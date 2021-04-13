import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8080');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ui: []
    };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      const stateToChange = {};
      console.log(dataFromServer);
      if (dataFromServer.type === "INIT" || dataFromServer.type === "CHANGE") {
        stateToChange.ui = dataFromServer.payload;
      } else if (dataFromServer.type === "ERROR") {
        console.log(dataFromServer.payload)
      }

      this.setState({
        ...stateToChange
      });
    };
  }
  
  render() {
    return (
      <div>
        UI incoming
      </div>
    );
  }
}

export default App;