/* global chrome */
/* global document */
import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ReactDOM from 'react-dom';
import Home from './components/home';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    document.body.style = 'background: gray;';
    chrome.storage.sync.get(['isDarkTheme'], (result) => {
      if (!result.isDarkTheme) {
        chrome.storage.sync.set({ isDarkTheme: false }, () => {
          document.body.style = 'background: #D3D3D3;';
          this.setState({ theme: getMuiTheme(lightBaseTheme) });
        });
      } else {
        chrome.storage.sync.set({ isDarkTheme: true }, () => {
          document.body.style = 'background: gray;';
          this.setState({ theme: getMuiTheme(darkBaseTheme) });
        });
      }
    });
    this.state = { theme: getMuiTheme(darkBaseTheme) };
    this.themeButtonClicked = this.themeButtonClicked.bind(this);
  }
  themeButtonClicked() {
    chrome.storage.sync.get(['isDarkTheme'], (result) => {
      if (result.isDarkTheme) {
        chrome.storage.sync.set({ isDarkTheme: false }, () => {
          document.body.style = 'background: #D3D3D3;';
          this.setState({ theme: getMuiTheme(lightBaseTheme) });
        });
      } else {
        chrome.storage.sync.set({ isDarkTheme: true }, () => {
          document.body.style = 'background: gray;';
          this.setState({ theme: getMuiTheme(darkBaseTheme) });
        });
      }
    });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={this.state.theme}>
        <Home ThemeButton={this.themeButtonClicked} />
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
