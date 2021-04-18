import WebSocket from 'ws';
import DataStorage from './DataStorage.js';

const startServer = (server, dataStorage) => {
  server.on('connection', (client) => {
    initializeConnection(client, dataStorage);

    registerMessageHandler(client, server, dataStorage, handleMessage);
  });
}

const initializeConnection = (client, dataStorage) => {
  const initObject = {
    type: "INIT",
    payload: dataStorage.state
  };

  client.send(JSON.stringify(initObject));
}

const registerMessageHandler = (client, server, dataStorage, messageHandler) => {
  client.on('message', (data) => {
    let message;

    try {
      message = JSON.parse(data);
    } catch (e) {
      sendError(client, 'Cannot parse data. Is it really JSON?');
      console.log("JSON parsing error");
      return;
    }

    messageHandler(message, client, server, dataStorage);
  });
}

const sendError = (client, message) => {
  const messageObject = {
    type: 'ERROR',
    payload: message,
  };

  client.send(JSON.stringify(messageObject));
};

const handleMessage = (message, sender, server, dataStorage) => {
  if (message.type === 'CHANGE') {
    dataStorage.update(message.payload);
    server.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        const updateObject = {
          type: "UPDATE",
          payload: message.payload
        };

        client.send(JSON.stringify(updateObject));
      }
    });
  } else {
    const errorMessage = "Unknown message type: " + message.type;
    console.log(errorMessage);
    sendError(sender, errorMessage);
  }
}

const initialState = {
  first: {
    type: "checkbox",
    state: [
      {
        value: "1",
        checked: false
      },
      {
        value: "2",
        checked: false
      },
      {
        value: "3",
        checked: false
      }
    ]
  },
  second: {
    type: "checkbox",
    state: [
      {
        value: "a",
        checked: false
      },
      {
        value: "b",
        checked: false
      }
    ]
  }
};

const dataStorage = new DataStorage(initialState);

const wss = new WebSocket.Server({
  port: 8080,
});

startServer(wss, dataStorage);