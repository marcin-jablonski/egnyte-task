import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import CheckboxGroup from './CheckboxGroup';

const client = new W3CWebSocket('ws://127.0.0.1:8080');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ui: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      const stateToChange = {};
      console.log(dataFromServer);
      if (dataFromServer.type === "INIT") {
        stateToChange.ui = dataFromServer.payload;
      } else if (dataFromServer.type === "CHANGE") {

      } else if (dataFromServer.type === "ERROR") {
        console.log(dataFromServer.payload)
      }

      this.setState({
        ...stateToChange
      });
    };
    client.onclose = () => {
      console.log('Disconnected')
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleChange(key, newKeyState) {
    const stateToChange = {
      [key]: newKeyState
    }

    this.setState({
      ui: {
        ...this.state.ui,
        ...stateToChange
      }
    })
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