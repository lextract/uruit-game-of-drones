import { GameEvent, MoveType } from '../enums';
import { Player } from '../dto/Player';
import { Socket } from 'socket.io';

class PlayerLogged extends Player {
    playing: boolean;
    socket: Socket;
}

let playersCache: Map<string, PlayerLogged> = new Map();

export function logInPlayer(playerId: string) : Player {
    if (isLoggedIn(playerId)) {
        return;
    }
    console.log("incia session: " + playerId)
    let p = <PlayerLogged>{ name: playerId };
    playersCache.set(p.name, p);
    return p;
    //return { sessionId: Math.random().toString() }
}

export function isLoggedIn(playerId: string) {
    return playersCache.has(playerId);
    
}

export function logOutPlayer(playerId: string) {
    if (playersCache.has(playerId) && playersCache.get(playerId).socket)
        playersCache.get(playerId).socket.disconnect();
    return playersCache.delete(playerId);
}


export function isAvailable(playerId: string) {
    let player = playersCache.get(playerId);
    if (player)
        return !player.playing;
    else return false;
}

export function setAvailable(playerId: string, a: boolean) {
    let player = playersCache.get(playerId);
    if (player) {
        player.playing = a;
    }
}

export function setSocket(playerId: string, socket: Socket) {
    let player = playersCache.get(playerId);
    if (player)
        player.socket = socket;
}

export function notifyNewBattle(gameId: number, defiant: string, opponent: string) {
    let player = playersCache.get(opponent);
    if (player) {
        player.socket.emit(GameEvent.NewBattle, gameId, defiant, opponent);
    }
}

export function cancelNewBattle(gameId: number, player1: string, player2: string) {
    let p1s = playersCache.get(player1);
    let p2s = playersCache.get(player2);
    p1s.socket.emit(GameEvent.CancelBattle, gameId);
    p2s.socket.emit(GameEvent.CancelBattle, gameId);
}

export function openBattleField(player1: string, player2: string) {
    let p1s = playersCache.get(player1);
    let p2s = playersCache.get(player2);
    p1s.socket.emit(GameEvent.OpenBattleField, player1, player2);
    p2s.socket.emit(GameEvent.OpenBattleField, player1, player2);
}

export function closeBattleField(player1: string, player2: string) {
    let p1s = playersCache.get(player1);
    let p2s = playersCache.get(player2);
    p1s.socket.emit(GameEvent.CloseBattleField);
    p2s.socket.emit(GameEvent.CloseBattleField);
}

export function notifyMove(playerId: string, moveType: MoveType) {
    playersCache.get(playerId).socket.emit(GameEvent.NotifyMove, moveType);
}
export function notifyWinner(player1: string, player2: string, winner: string) {
    playersCache.get(player1).socket.emit(GameEvent.NotifyWinner, winner);
    playersCache.get(player2).socket.emit(GameEvent.NotifyWinner, winner);
}
