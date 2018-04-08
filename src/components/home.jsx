import React, { Component } from 'react';
import Grid from './grid';

/*
 * might be wise to rename this file since it's imported by another
 * popup.js file..
 */
class Home extends Component {
  constructor(props) {
    super(props);
  }

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
