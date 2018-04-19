import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from './components/home';
import './index.css';

const App = () => (
  <MuiThemeProvider>
    <Home />
  </MuiThemeProvider>
);
/* global document */
ReactDOM.render(<App />, document.getElementById('root'));
