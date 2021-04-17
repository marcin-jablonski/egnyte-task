import React, { Component } from 'react';

class CheckboxGroup extends Component {
  constructor(props) {
    super(props);
    var mapped = this.props.state.map(item => ({ [item.value]: item.checked }));
    var stateObject = Object.assign({}, ...mapped);
    this.state = stateObject;
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.state !== this.props.state) {
      var mapped = this.props.state.map(item => ({ [item.value]: item.checked }));
      var stateObject = Object.assign({}, ...mapped);
      this.setState({
        ...stateObject
      })
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.checked;
    const name = target.value;

    this.setState({
      [name]: value
    },
      () => {
        this.props.handleChange(this.props.name, {
          type: "checkbox",
          state: Object.entries(this.state).map(([key, value]) => {
            return ({
              value: key,
              checked: value
            })
          })
        })
      });
  }

  render() {
    return (
      <div>
        {Object.entries(this.state).map(([key, value]) => {
          return (
            <label key={key}>
              {key}
              <input type="checkbox" value={key} checked={value} onChange={this.handleInputChange} />
            </label>
          )
        })}
      </div>
    )
  }
}

export default CheckboxGroup