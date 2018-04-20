import React, { Component } from 'react';
import { TextField } from 'material-ui';

const ENTER_KEY = 13;

class TextBox extends Component {
  /* wraps a TextField component so the parent only needs to worry
        about on submit */
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      key: props.specialKey,
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
    if (val) {
      this.props.onSubmit(val);
      this.setState({ value: '' });
    }
  }

  render() {
    return (
      <TextField
        {...this.props}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}


export default TextBox;

/*
<TextField
                hintText={this.props.hintText}
                defaultValue={this.props.defaultValue}
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                floatingLabelText={this.props.floatingLabelText}
                fullWidth
              />
*/
