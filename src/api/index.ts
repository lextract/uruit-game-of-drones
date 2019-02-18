import * as express from 'express';
import game from './game';
import auth from './auth';

let apiApp = express();

export default function (app: express.Application) {
    apiApp.use(express.json());
    apiApp.use(auth);
    apiApp.use(game);
    apiApp.use((req, res)=>{
        res.status(404).json();
    })
    app.use('/api', apiApp);
}