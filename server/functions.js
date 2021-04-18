import WebSocket from 'ws';

export function startServer(server, dataStorage) {
  console.log("Starting server...")
  server.on('connection', (client) => {
    initializeConnection(client, dataStorage);

    registerMessageHandler(client, server, dataStorage, handleMessage);
  });
  console.log("Server up and running!")
}

export function initializeConnection(client, dataStorage) {
  const initObject = {
    type: "INIT",
    payload: dataStorage.state
  };

  client.send(JSON.stringify(initObject));
}

export function registerMessageHandler(client, server, dataStorage, messageHandler) {
  client.on('message', (data) => {
    let message;

    try {
      message = JSON.parse(data);
    } catch (e) {
      sendError(client, 'Cannot parse data. Is it really JSON?');
      console.log("JSON parsing error");
      return;
    }

    try {
      messageHandler(message, client, server, dataStorage);
    } catch (error) {
      console.log(error);
      sendError(client, error);
    }

  });
}

export function sendError(client, message) {
  const messageObject = {
    type: 'ERROR',
    payload: message,
  };

  client.send(JSON.stringify(messageObject));
};

export function handleMessage(message, sender, server, dataStorage) {
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
    throw errorMessage;
  }
}