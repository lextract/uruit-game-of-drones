import * as express from 'express';
import game from './game';
import auth from './auth';

//import users from './users';
//import express = require('express');

let apiApp = express();

export default function (app: express.Application) {
    apiApp.use(express.json());
    apiApp.use(auth);
    apiApp.use(game);
    //users(apiApp);
    apiApp.use((req, res)=>{
        res.status(404).json();
    })
    app.use('/api', apiApp);
}