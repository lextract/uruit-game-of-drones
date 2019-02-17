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
        let player = socket.handshake.query.player;
        if (!player) {
            socket.disconnect();
            return;
        }
        console.log('se conecto: ' + socket.handshake.query.player);
        playerBll.setSocket(player, socket);

        socket.on(GameEvent.RequestGame, function (opponent) {
            if (opponent)
                gameBll.requestGame(socket.handshake.query.player, opponent);
        });

        socket.on(GameEvent.CancelGame, gameId => {
            gameBll.cancelGame(gameId);
        });

        socket.on(GameEvent.StartGame, gameId => {
            gameBll.startGame(gameId);
        });
        socket.on(GameEvent.StopGame, gameId => {
            let player = socket.handshake.query.player;
            gameBll.stopGame(gameId, player);
        });

        socket.on(GameEvent.MakeMove, (gameId, moveType) => {
            console.log('plyer movieng:  ' + moveType);
            let player = socket.handshake.query.player;
            gameBll.makeMove(gameId, player, moveType);
        });

        socket.on('moveChosen', (roundId) => {
            //console.log('RequestGame : ' + opponent);
        })

        socket.on('disconnect', function () {

            playerBll.logOutPlayer(socket.handshake.query.player);
            console.log('__disconnected__ : ' + socket.handshake.query.player);
            // playersUid.delete(socket.handshake.query.player)
            // playersSocket.delete(socket.handshake.query.uid);
        });
    });

}