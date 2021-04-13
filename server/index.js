import WebSocket from 'ws';

const uiConfig = [
  [
    {
      type: "checkbox",
      value: true,
      label: "Grp1Chkbx1"
    },
    {
      type: "checkbox",
      value: false,
      label: "Grp1Chkbx2"
    }
  ],
  [
    {
      type: "checkbox",
      value: false,
      label: "Grp2Chkbx1"
    },
    {
      type: "checkbox",
      value: false,
      label: "Grp2Chkbx2"
    }
  ]
];

var state = uiConfig;

const wss = new WebSocket.Server({
  port: 8080,
});

wss.on('connection', (ws) => {
  const initObject = {
    type: "INIT",
    payload: uiConfig
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