import { Game } from '../dto/Game';
import { Match } from '../dto/Match';
import * as playerBll from './PlayerBll';
import { MoveType } from '../enums';


let gamesCache: Map<number, Game> = new Map();

export function requestGame(defiant: string, opponent: string) {
    opponent = opponent.toLowerCase();
    if (typeof opponent != "string" || opponent.length < 3 || opponent.length > 20) {
        playerBll.sendMessage(defiant, 'Invalid player name.')
        return;
    }
    let newGame = { defiant: defiant, opponent: opponent } as Game;
    if (playerBll.isLoggedIn(opponent)) {
        newGame.id = createGame(defiant, opponent);
        playerBll.notifyRequestedGame(newGame);
    }
    else playerBll.sendMessage(defiant, `The player "${opponent}" is not logged in the system`)
    return newGame;
}

function createGame(player1: string, player2: string) {
    let idGame = Math.random();
    gamesCache.set(idGame, {
        id: idGame,
        defiant: player1,
        opponent: player2,
        started: false,
        roundsIds: []
    })
    return idGame;
}

export function getGames(playerId: string) {
    let games: Game[] = [];
    gamesCache.forEach(game => {
        if (game.defiant == playerId || game.opponent == playerId)
            games.push(game);
    });
    return games;
}

export function startGame(gameId: number) {
    let game = gamesCache.get(gameId);
    if (!playerBll.isPlaying(game.defiant)) {
        playerBll.setPlaying(game.defiant, true);
        playerBll.setPlaying(game.opponent, true);
        playerBll.openBattleField(game);
        game.started = true;
    }
    else {
        playerBll.sendMessage(game.opponent, `The player "${game.defiant}" is currently in other game`);
    }
    return game;
}

export function cancelGame(id: number) {
    let game = gamesCache.get(id);
    playerBll.cancelNewBattle(game.id, game.defiant, game.opponent);
    return gamesCache.delete(id);
}

export function stopGame(gameId: number, player: string) {
    let game = gamesCache.get(gameId);
    if (game) {
        playerBll.setPlaying(game.defiant, false);
        playerBll.setPlaying(game.opponent, false);
        playerBll.closeBattleField(game);
        let message = `The player "${player}" has stopped the game`;
        playerBll.sendMessage(game.defiant, message);
        playerBll.sendMessage(game.opponent, message);
    }
    return gamesCache.delete(gameId);
}

export function makeMove(gameId: number, playerId: string, moveType: MoveType) {
    let game = gamesCache.get(gameId);
    if (!game.currentMatch) game.currentMatch = {} as Match;

    if (game.defiant == playerId) {
        game.currentMatch.player1move = moveType;
    }
    else {
        game.currentMatch.player2move = moveType;
    }

    if (game.currentMatch.player1move && game.currentMatch.player2move) {
        determineWinner(game.currentMatch, game.defiant, game.opponent);
        playerBll.notifyMatchResult(game.currentMatch, game.defiant, game.opponent);
        // TODO: fill up statistics about matches
        game.currentMatch = undefined;
    }
}

function determineWinner(match: Match, player1: string, player2: string) {
    if (match.player1move == match.player2move)
        return;
    if (match.player1move == MoveType.Paper) {
        if (match.player2move == MoveType.Rock)
            match.winner = player1;
        else match.winner = player2;
    }
    else if (match.player1move == MoveType.Rock) {
        if (match.player2move == MoveType.Scissors)
            match.winner = player1;
        else match.winner = player2;
    }
    else if (match.player1move == MoveType.Scissors) {
        if (match.player2move == MoveType.Paper)
            match.winner = player1;
        else match.winner = player2;
    }
}
