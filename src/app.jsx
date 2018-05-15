/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/home';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';
/* global document */

const App = () => (
  <MuiThemeProvider>
    <Home />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
