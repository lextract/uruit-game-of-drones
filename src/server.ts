import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

import api from './api';
import socketServer from './socketServer';

let serverApp = express();
let serverPort = process.env.PORT || 3000;
let httpServer = http.createServer(serverApp);

serverApp.set('port', serverPort);
serverApp.use('/', express.static(path.resolve(__dirname, './webapp')));



api(serverApp);

socketServer(httpServer);

serverApp.use(function (req, res) {
  res.status(404).send('Not encontrado (>.<)');
})


httpServer.listen(serverPort, () => {
  console.log('Servidor eschuchando en: ' + serverPort);
})


