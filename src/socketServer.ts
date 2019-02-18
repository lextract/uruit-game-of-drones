import * as socketio from 'socket.io';
import * as playerBll from './bll/PlayerBll';
import * as gameBll from './bll/GameBll';
import { GameEvent } from './enums';

export default function (httpServer) {

    let socketServer = socketio(httpServer);

    socketServer.on('connection', socket => {
        let player = socket.handshake.query.player;
        if (!player) {
            socket.disconnect();
            return;
        }
        playerBll.setSocket(player, socket);

        socket.on(GameEvent.RequestGame, opponent => {
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
            let player = socket.handshake.query.player;
            gameBll.makeMove(gameId, player, moveType);
        });

        socket.on('disconnect', function () {
            playerBll.logOutPlayer(socket.handshake.query.player);
        });
    });
}