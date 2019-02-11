import { Router, Request, Response, Application } from 'express';
import { Server } from 'socket.io';
import * as gameBll from '../bll/GameBll';

const router = Router();
//let ioServer: Server;

// router.route('/game')
//     .get(function (req: Request, res: Response) {
//         // TODO: validate if there is a session started
//         //ioServer.sockets
//         res.json("creating user by id: " + req.params.id);
//     })
//     .post(function (req: Request, res: Response) {
//         res.json(gameBll.requestGame(req.body.defiant, req.body.opponent));
//     })
//     .delete(function (req: Request, res: Response) {
//         // TODO: close session by :id
//         res.json("deleting user by id: " + req.params.id);
//     });
router.route('/game/request').post((req, res) => {
    res.json(gameBll.requestGame(req.body.defiant, req.body.opponent));
});
router.route('/game/start').post((req, res) => {
    res.json(gameBll.startGame(req.body.id));
});
router.route('/game/cancel').post((req, res) => {
    res.json(gameBll.cancelGame(req.body.id));
})
router.route('/game/end').post((req, res) => {
    res.json(gameBll.endGame(req.body.id));
})

export default router;
// export default function (app: Application, socketServer: Server) {
//     app.use(router);
//     ioServer = socketServer;

// }
