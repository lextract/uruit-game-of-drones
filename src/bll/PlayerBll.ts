import { GameEvent, MoveType } from '../enums';
import { Player } from '../dto/Player';
import { Game } from '../dto/Game';
import { Socket } from 'socket.io';
import { Message } from '../dto/Message';
import { Match } from '../dto/Match';

class PlayerLogged extends Player {
    playing: boolean;
    socket: Socket;
}

let playersCache: Map<string, PlayerLogged> = new Map();

export function logInPlayer(playerId: string) : Player {
    if (isLoggedIn(playerId)) {
        return;
    }
    let p = <PlayerLogged>{ name: playerId };
    playersCache.set(p.name, p);
    return p;
    //return { sessionId: Math.random().toString() }
}

export function isLoggedIn(playerId: string) {
    return playersCache.has(playerId);
}

export function logOutPlayer(playerId: string) {
    if (playersCache.has(playerId)) {
        if(playersCache.get(playerId).socket)
            playersCache.get(playerId).socket.disconnect();
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

export function notifyNewBattle(gameId: number, defiant: string, opponent: string) {
    let player = playersCache.get(opponent);
    if (player) {
        player.socket.emit(GameEvent.NewBattle, gameId, defiant, opponent);
    }
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

export function notifyMove(playerId: string, moveType: MoveType) {
    //playersCache.get(playerId).socket.emit(GameEvent.NotifyMove, moveType);
}
export function notifyMatchResult(match: Match, player1: string, player2: string) {
    playersCache.get(player1).socket.emit(GameEvent.NotifyMatchResult, match);
    playersCache.get(player2).socket.emit(GameEvent.NotifyMatchResult, match);
}

export function sendMessage(player: string, text: string) {
    let message = { text: text } as Message;
    playersCache.get(player).socket.emit(GameEvent.NewMessage, message);
}
