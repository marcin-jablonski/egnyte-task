import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import CheckboxGroup from './CheckboxGroup';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      ui: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.connect = this.connect.bind(this);
  }

  connect() {
    const client = new W3CWebSocket('ws://127.0.0.1:8080');

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      this.setState({
        ...this.state,
        client: client
      });
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      let stateToChange = {};

      if (dataFromServer.type === "INIT") {
        stateToChange = {
          ...this.state,
          ui: {
            ...dataFromServer.payload
          }
        };
      } else if (dataFromServer.type === "UPDATE") {
        stateToChange = {
          ...this.state,
          ui: {
            ...this.state.ui,
            ...dataFromServer.payload
          }
        }
      } else if (dataFromServer.type === "ERROR") {
        // obviously not the state-of-the-art, but no time :)
        console.log(dataFromServer.payload)
      }

      this.setState({
        ...stateToChange
      });
    };
    client.onclose = () => {
      console.log('Disconnected, trying to reconnect...')
      this.setState({
        ...this.state,
        client: null
      });
      // probably incremental reconnect time could work better
      setTimeout(this.connect, 1000);
    };
    client.onerror = (err) => {
      console.log(err.message);
      client.close();
    }
  }

  componentDidMount() {
    this.connect();
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleChange(key, newKeyState) {
    const stateToChange = {
      [key]: newKeyState
    };

    this.setState({
      ...this.state,
      ui: {
        ...this.state.ui,
        ...stateToChange
      }
    });

    this.state.client.send(JSON.stringify({
      type: "CHANGE",
      payload: stateToChange
    }))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {
          Object.entries(this.state.ui).map(([key, value]) => {
            if (value.type === "checkbox") {
              return (
                <CheckboxGroup key={key} name={key} state={value.state} handleChange={this.handleChange} />
              )
            } else {
              // possible implementation of other input types
              return (
                <div>
                  Unknown input type
                </div>
              )
            }

          })
        }
      </form>
    );
  }
}

export default App;