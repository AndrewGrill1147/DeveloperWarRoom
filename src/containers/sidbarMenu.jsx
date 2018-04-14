import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import MenuList from './../components/menuList';

const appBarStyle = {
  backgroundColor: 'gray',
};
class SidebarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { sideBarOpen: true };
    this.menuButtonClicked = this.menuButtonClicked.bind(this);
  }
  menuButtonClicked() {
    this.setState({ sideBarOpen: !this.state.sideBarOpen });
  }
  render() {
    return (
      <div>
        <RaisedButton onClick={this.menuButtonClicked} label="Edit" />
        <Drawer open={this.state.sideBarOpen} width={250} openSecondary >
          <AppBar style={appBarStyle} iconElementRight={<FlatButton label="Theme" onClick={this.props.ThemeButton} />} />
          <MenuList />
        </Drawer>
      </div>
    );
  }
}

export default SidebarMenu;
