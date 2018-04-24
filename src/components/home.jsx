import React, { Component } from 'react';
import Grid from './../containers/grid';

/*
 * might be wise to rename this file since it's imported by another
 * popup.js file..
 */

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <div>
        <Grid ThemeButton={this.props.ThemeButton} />
      </div>
    );
  }
}

export default Home;
