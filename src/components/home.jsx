import React, { Component } from 'react';
import Grid from './grid';
/* eslint react/prefer-stateless-function: 0 */

class Home extends Component {
  render() {
    return (
      <div>
        This is the applications home page.
        <Grid />
      </div>
    );
  }
}

export default Home;
