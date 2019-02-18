import { Router, Request, Response } from 'express';
import * as playerBll from '../bll/PlayerBll';
import { Player } from '../dto/Player';

const router = Router();

router.route('/auth')
    .post(function (req: Request, res: Response) {
        let result = playerBll.logInPlayer(req.body.name);
        if (result instanceof Player) res.status(201).json(result);
        else res.status(204).json(result);
    });
router.route('/auth/:name')
    .delete(function (req: Request, res: Response) {
        res.json(playerBll.logOutPlayer(req.params.name));
    });

export default router;
