import React, { Component } from 'react';
/* eslint react/prefer-stateless-function: 0 */

class Popup extends Component {
  render() {
    return (
      <div>
        Hello World!
        <div id="links">
          <a href="app.html" target="_blank">Application</a>
        </div>
      </div>
    );
  }
}

export default Popup;
