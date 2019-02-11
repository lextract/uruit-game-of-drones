import { Game } from '../dto/Game';
import { Match } from '../dto/Match';
import * as playerBll from './PlayerBll';
import { MoveType } from '../enums';


let gamesCache: Map<number, Game> = new Map();

export function requestGame(defiant: string, opponent: string) {
    let newGame = {} as Game;
    if (playerBll.isLoggedIn(opponent)) {
        newGame.id = createGame(defiant, opponent);
        playerBll.notifyNewBattle(newGame.id, defiant, opponent);
        newGame.player1id = defiant;
        newGame.player2id = opponent;
    }
    return newGame;
}

function createGame(player1: string, player2: string) {
    let idGame = Math.random();
    gamesCache.set(idGame, {
        id: idGame,
        player1id: player1,
        player2id: player2,
        started: false,
        roundsIds: []
    })
    return idGame;
}

export function getGames(playerId: string) {
    let games: Game[] = [];
    gamesCache.forEach(game => {
        if (game.player1id == playerId || game.player2id == playerId)
            games.push(game);
    });
    return games;
}

export function startGame(id: number) {
    let game = gamesCache.get(id);
    if (playerBll.isAvailable(game.player1id) && playerBll.isAvailable(game.player2id)) {
        playerBll.setAvailable(game.player1id, false);
        playerBll.setAvailable(game.player2id, false);
        game.started = true;
        playerBll.openBattleField(game.player1id, game.player2id);
    }
    return game;
}

export function cancelGame(id: number) {
    //TODO: mandar a borrar el game del oponente
    let game = gamesCache.get(id);
    playerBll.cancelNewBattle(game.id, game.player1id, game.player2id);
    return gamesCache.delete(id);
}

export function endGame(id: number) {
    let game = gamesCache.get(id);
    if (game) {
        playerBll.setAvailable(game.player1id, true);
        playerBll.setAvailable(game.player2id, true);
        playerBll.closeBattleField(game.player1id, game.player2id);
    }
    return gamesCache.delete(id);
}

export function makeMove(gameId: number, playerId: string, moveType: MoveType){
    let game = gamesCache.get(gameId);
    if (!game.currentMatch) game.currentMatch = {} as Match;

    if (game.player1id == playerId){
        game.currentMatch.player1move = moveType;
        playerBll.notifyMove(game.player2id, moveType);
    }
    else {
        game.currentMatch.player2move = moveType;
        playerBll.notifyMove(game.player1id, moveType);
    }
    
    if (game.currentMatch.player1move && game.currentMatch.player2move){
        //game.currentMatch.winner
        console.log(game.currentMatch.player1move);
    }
}
