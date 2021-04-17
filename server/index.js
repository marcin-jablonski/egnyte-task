import WebSocket from 'ws';

const state = {
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

const wss = new WebSocket.Server({
  port: 8080,
});

wss.on('connection', (ws) => {
  const initObject = {
    type: "INIT",
    payload: state
  };

  ws.send(JSON.stringify(initObject));

  ws.on('message', (data) => {
    let message;

    try {
      message = JSON.parse(data);
    } catch (e) {
      sendError(ws, 'Cannot parse data. Is it really JSON?');

      return;
    }

    if (message.type === 'CHANGE') {
      // handle state change
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          const updateObject = {
            type: "UPDATE",
            payload: state
          };

          client.send(JSON.stringify(updateObject));
        }
      });
    }

  });
});

const sendError = (ws, message) => {
  const messageObject = {
    type: 'ERROR',
    payload: message,
  };

  ws.send(JSON.stringify(messageObject));
};