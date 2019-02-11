import { Router, Request, Response } from 'express';
import * as playerBll from '../bll/PlayerBll';

const router = Router();

router.route('/auth')
    .post(function (req: Request, res: Response) {
        let player = playerBll.logInPlayer(req.body.name);
        if (player) res.status(201).json(player);
        else res.status(204).json({});
    });
router.route('/auth/:name')
    .delete(function (req: Request, res: Response) {
        res.json(playerBll.logOutPlayer(req.params.name));
    });

export default router;
