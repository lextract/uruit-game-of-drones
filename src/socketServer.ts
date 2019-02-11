import * as socketio from 'socket.io';
import * as playerBll from './bll/PlayerBll';
import * as gameBll from './bll/GameBll';
import { GameEvent } from './enums';

export default function (httpServer) {



    let socketServer = socketio(httpServer);

    let playersSocket: Map<string, socketio.Socket> = new Map();
    let playersUid: Map<string, string> = new Map();
    //let socketsPlayer:

    socketServer.on('connection', socket => {
        //let room = socket.handshake.query.player;

        let player = socket.handshake.query.player;
        // let uid = socket.handshake.query.uid;

        // if (!player || !uid) {
        //     socket.disconnect();
        //     return;
        // }
        // playersUid.set(player, uid);
        // playersSocket.set(uid, socket);
        if(!player){
            socket.disconnect();
            return;
        }
        playerBll.setSocket(player, socket);

        // socket.join(room);
        // socketsPlayers.set(room, socket);
        //socketServer.to('room123').emit('tipoEvento',12345);
        socket.on(GameEvent.NewBattle, function (defiant) {
            gameBll.requestGame(socket.handshake.query.player, defiant)
            // if (playersUid.has(target)) {
            //     let sou = playersSocket.get(playersUid.get(target));
            //     sou.emit('battleRequested', defiant);
            // }
            // else {
            //     socket.emit('battleNoOpponent');
            // }
        });

        socket.on(GameEvent.OpenBattleField, function (target, defiant) {
            //gameBll.startGame()
            // if (playersUid.has(target)) {
            //     let sou = playersSocket.get(playersUid.get(target));
            //     sou.emit('battleStarted', defiant);
            //     // TODO: create round in bll
            // }
            // else {
            //     socket.emit('battleNoOpponent');
            // }
        });

        socket.on('moveChosen', (roundId) => {

        })

        socket.on('disconnect', function () {
            //playerBll.logOutPlayer(socket.handshake.query.player);
            console.log('__disconnected__ : ' + socket.id);
            // playersUid.delete(socket.handshake.query.player)
            // playersSocket.delete(socket.handshake.query.uid);
        });
    });

}