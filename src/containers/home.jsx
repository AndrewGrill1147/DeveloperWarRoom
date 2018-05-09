import React, { Component } from 'react';
import Grid from './../components/Grid';

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
