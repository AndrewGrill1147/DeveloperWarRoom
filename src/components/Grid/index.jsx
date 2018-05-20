/* eslint-env browser */
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionLockClosed from 'material-ui/svg-icons/action/lock';
import EditorEdit from 'material-ui/svg-icons/editor/mode-edit';
import _ from 'lodash';
import SettingIcon from 'material-ui/svg-icons/action/settings';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import GridLayout from 'react-grid-layout';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Bookmarker from './../../components/Bookmarker';
import Widgets from './../../helpers/widgetRegistration';
import LocalStorageAPI from './../../helpers/localstorageAPI';

const styles = {
  fixedToBottom: {
    position: 'fixed',
    bottom: '0',
    right: '0',
    margin: '10px',
  },
  removeStyle: {
    position: 'absolute',
    right: '2px',
    top: 0,
    cursor: 'pointer',
  },
  removeIconSize: {
    width: 20,
    height: 20,
  },
  horizontalHeaderBarStyle: {
    display: 'inline',
    whiteSpace: 'nowrap',
  },
  iconAlignment: {
    position: 'fixed',
    top: '0',
    right: '0',
    marginTop: '8px',
  },
  style: {
    height: '100%',
    width: '100%',
    textAlign: 'left',
    display: 'inline-block',
  },
  menuBarStyle: {
    backgroundColor: 'rgb(0, 188, 212)',
  },
};

const RemoveIcon = props => (
  <IconButton iconStyle={styles.removeIconSize}>
    <ActionDelete {...props} />
  </IconButton>
);


class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      sideBarMenu: false,
      sideBarOpen: false,
      layout: [],
      storageKey: this.constructor.name,
    };

    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.componentInGrid = this.componentInGrid.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onSettingsButtonClick = this.onSettingsButtonClick.bind(this);
    this.setStrikethrough = this.setStrikethrough.bind(this);

    const localValue = LocalStorageAPI.get(this.state.storageKey);
    this.state.layout = localValue || [];
  }

  onRemoveItem(i) {
    this.setState({ layout: _.reject(this.state.layout, { i }) });
  }

  onLayoutChange(newLayout) {
    LocalStorageAPI.put(this.state.storageKey, newLayout);
    this.setState({ layout: newLayout });
  }

  onSettingsButtonClick() {
    const opened = !this.state.sideBarOpen;
    this.setState({ sideBarOpen: opened });
  }

  setStrikethrough(key) {
    if (this.componentInGrid(key)) {
      return { textDecorationLine: 'line-through' };
    }
    return {};
  }

  componentInGrid(key) {
    return this.state.layout.some(gridItem => gridItem.i === key);
  }

  createElement(element) {
    let removeButton = null;
    if (this.state.editMode) {
      removeButton = (
        <span
          className="remove"
          style={styles.removeStyle}
        >
          <RemoveIcon color="grey" onClick={this.onRemoveItem.bind(this, element.i)} onKeyDown={this.handleKeyPress} />
        </span>
      );
    }

    return (
      <div key={element.i}>
        <Paper style={styles.style} zDepth={3}>
          {Widgets[element.i]}
          {removeButton}
        </Paper>
      </div>
    );
  }

  widgetsMenu() {
    const widgetList = Object.keys(Widgets).map((key) => {
      const returnVal = (<ListItem
        key={key}
        primaryText={key}
        disabled={this.componentInGrid(key)}
        onClick={() => { this.addWidget(key); }}
        style={this.setStrikethrough(key)}
      />);
      return returnVal;
    });

    return widgetList;
  }

  addWidget(key) {
    if (this.state.layout.filter(widgetLayout => widgetLayout.i === key).length !== 0) {
      return;
    }
    const newWidget = {
      i: key,
      //make this bottom left
      x: (this.state.layout.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
    };
    this.setState({
      // Add a new item. It must have a unique key!
      layout: [...this.state.layout, ...[newWidget]],
    });
  }

  onEditButtonClick() {
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
    if (flipped === false && this.state.sideBarMenu === true) {
      this.setState({ sideBarMenu: false });
    }
  }

  renderSettingsDrawer() {
    return (
      <div>
          <AppBar style={styles.menuBarStyle} title="Settings" showMenuIconButton={false} />
          <List>
            <ListItem
              primaryText="Widget List"
              initiallyOpen
              primaryTogglesNestedList
              nestedItems={this.widgetsMenu()}
            />
            <Divider />
            <ListItem primaryText="Toggle Edit" onClick={this.onEditButtonClick} rightIcon={this.state.editMode ? <EditorEdit /> : <ActionLockClosed />} />
            <Divider />
            <ListItem primaryText="Switch Theme" onClick={this.props.ThemeButton} />
            <Divider />
          </List>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div style={styles.horizontalHeaderBarStyle}>
          <Paper zDepth={2}>
            <Bookmarker />
          </Paper>
        </div>
        <GridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          autoSize
          width={1400}
          isDraggable={this.state.editMode}
          isResizable={this.state.editMode}
          {...this.props}
        >
          {this.state.layout.map(element => this.createElement(element))}
        </GridLayout>

        <Drawer open={this.state.sideBarOpen} width={200}>
          {this.renderSettingsDrawer()}
        </Drawer>

        {/* Bottom-right settings icon*/}
        <FloatingActionButton style={styles.fixedToBottom} onClick={this.onSettingsButtonClick}>
          <SettingIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

export default Grid;
