import React, { Component } from 'react';
import { TextField } from 'material-ui';

const ENTER_KEY = 13;

class TextBox extends Component {
  /* wraps a TextField component so the parent only needs to worry
        about on submit */
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onChange(event, newValue) {
    this.setState({ value: newValue });
  }

  onKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();

    const val = this.state.value.trim();
    const key = this.props.settingskey;
    if (key && val) {
      this.props.onSubmit(key, val);
    }
  }

  render() {
    // note: settingskey, savedvalued prop gets passed all the way down to DOM element :/
    return (
      <TextField
        {...this.props}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        errorText={this.state.value !== this.props.savedvalue ? 'This value is not saved' : null}
      />
    );
  }
}


export default TextBox;

