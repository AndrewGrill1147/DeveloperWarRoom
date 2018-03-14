import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ReactDOM from 'react-dom';
import Home from './components/home';
import SidebarMenu from './components/sidebarMenu';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isDarkTheme: true, theme: getMuiTheme(darkBaseTheme) };
    this.themeButtonClicked = this.themeButtonClicked.bind(this);
  }
  themeButtonClicked() {
    if (this.state.isDarkTheme) {
      this.setState({ isDarkTheme: false, theme: getMuiTheme(lightBaseTheme) });
    } else {
      this.setState({ isDarkTheme: true, theme: getMuiTheme(darkBaseTheme) });
    }
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={this.state.theme}>
        <SidebarMenu ThemeButton={this.themeButtonClicked} />
        <Home />
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
