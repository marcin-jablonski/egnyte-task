import WebSocket from 'ws';
import DataStorage from './DataStorage.js';
import initialState from './data.js';
import { startServer } from './functions.js';

const dataStorage = new DataStorage(initialState);

const wss = new WebSocket.Server({
  port: 8080,
});

startServer(wss, dataStorage);