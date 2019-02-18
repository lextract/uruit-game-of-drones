import { GameEvent, MoveType } from '../enums';
import { Player } from '../dto/Player';
import { Game } from '../dto/Game';
import { Socket } from 'socket.io';
import { Message } from '../dto/Message';
import { Match } from '../dto/Match';

let playersCache: Map<string, Player> = new Map();

export function logInPlayer(name: string) {
    let result = {} as Message;
    if (typeof name != "string" || name.length < 3 || name.length > 20) {
        result.text = "Invalid user name.";
        return result;
    }
    name = name.toLowerCase();
    if (isLoggedIn(name)) {
        result.text = `The user "${name}" is already logged in.`;
        return result;
    }
    let p = new Player();
    p.name = name;
    playersCache.set(p.name, p);
    return p;
}

export function isLoggedIn(playerId: string) {
    return playersCache.has(playerId);
}

export function logOutPlayer(playerId: string) {
    let player = playersCache.get(playerId);
    if (player) {
        if(player.socket) {
            //if (player.playing) 
            // TODO: implement close game when player is playing
            playersCache.get(playerId).socket.disconnect();
        }
            
    }
    return playersCache.delete(playerId);
}


export function isPlaying(playerId: string) {
    let player = playersCache.get(playerId);
    return player.playing;
}

export function setPlaying(playerId: string, a: boolean) {
    let player = playersCache.get(playerId);
    player.playing = a;
}

export function setSocket(playerId: string, socket: Socket) {
    let player = playersCache.get(playerId);
    if (player)
        player.socket = socket;
    else socket.disconnect();
}

export function notifyRequestedGame(game: Game) {
    let defiant = playersCache.get(game.defiant);
    defiant.socket.emit(GameEvent.RequestGame, game);
    let opponent = playersCache.get(game.opponent);
    opponent.socket.emit(GameEvent.RequestGame, game);
}

export function cancelNewBattle(gameId: number, player1: string, player2: string) {
    let p1s = playersCache.get(player1);
    let p2s = playersCache.get(player2);
    p1s.socket.emit(GameEvent.CancelGame, gameId);
    p2s.socket.emit(GameEvent.CancelGame, gameId);
}

export function openBattleField(game: Game) {
    let p1s = playersCache.get(game.defiant);
    let p2s = playersCache.get(game.opponent);
    p1s.socket.emit(GameEvent.StartGame, game);
    p2s.socket.emit(GameEvent.StartGame, game);
}

export function closeBattleField(game: Game) {
    let p1s = playersCache.get(game.defiant);
    let p2s = playersCache.get(game.opponent);
    p1s.socket.emit(GameEvent.StopGame, game);
    p2s.socket.emit(GameEvent.StopGame, game);
}

export function notifyMatchResult(match: Match, player1: string, player2: string) {
    playersCache.get(player1).socket.emit(GameEvent.NotifyMatchResult, match);
    playersCache.get(player2).socket.emit(GameEvent.NotifyMatchResult, match);
}

export function sendMessage(player: string, text: string) {
    let message = { text: text } as Message;
    playersCache.get(player).socket.emit(GameEvent.NewMessage, message);
}
