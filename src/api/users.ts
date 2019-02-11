import {Router, Request, Response, Application} from 'express';

const router = Router();

router.route('/users')
    .get(function(req: Request, res: Response){
        res.json("returning all users CCC");
    })
    .post(function(req: Request, res: Response){
        res.json("submit new user");
    });

router.route('/users/:id')
    .get(function(req: Request, res: Response){
        res.json("returning user by id: " + req.params.id);
    })
    .put(function(req: Request, res: Response){
        res.json("updating user by id: " + req.params.id);
    })
    .delete(function(req: Request, res: Response){
        res.json("deleting user by id: " + req.params.id);
    });

export default function(app: Application) {
    app.use(router);
}
