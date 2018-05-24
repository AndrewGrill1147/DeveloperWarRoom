/* eslint-env browser */
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import ActionLockClosed from 'material-ui/svg-icons/action/lock';
import EditorEdit from 'material-ui/svg-icons/editor/mode-edit';
import _ from 'lodash';
import SettingIcon from 'material-ui/svg-icons/action/settings';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import GridLayout from 'react-grid-layout';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Bookmarker from './../../components/Bookmarker';
import Widgets from './widgetRegistration';
import LocalStorageAPI from './../../helpers/localstorageAPI';
import RemoveIcon from './icons';

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

    this.editButtonClicked = this.editButtonClicked.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.elementinArray = this.elementinArray.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.settingsButtonClicked = this.settingsButtonClicked.bind(this);
    this.setStrikethrough = this.setStrikethrough.bind(this);

    const localValue = LocalStorageAPI.get(this.state.storageKey);
    this.state.layout = localValue || [];
  }

  onRemoveItem(i) {
    if (this.state.layout.includes(i) === true) {
      return;
    }
    this.setState({ layout: _.reject(this.state.layout, { i }) });
  }

  onLayoutChange(newLayout) {
    const layouts = newLayout;
    for (let i = 0; i < layouts.length; i += 1) {
      if (layouts[i].w < 2) { layouts[i].w = 2; }

      if (layouts[i].h < 2) { layouts[i].h = 2; }
    }
    LocalStorageAPI.put(this.state.storageKey, layouts);

    this.setState({ layout: layouts });
  }

  settingsButtonClicked() {
    const opened = !this.state.sideBarOpen;
    this.setState({ sideBarOpen: opened });
  }

  setStrikethrough(key) {
    if (this.elementinArray(key)) {
      return { textDecorationLine: 'line-through' };
    }
    return {};
  }

  elementinArray(key) {
    for (let i = 0; i < this.state.layout.length; i += 1) {
      if (this.state.layout[i].i === key) {
        return true;
      }
    }
    return false;
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
      <div key={element.i} data-grid={element}>
        <Paper style={styles.style} zDepth={3}>

          {Widgets[element.i].component}
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
        disabled={this.elementinArray(key)}
        onClick={() => { this.addWidget(key); }}
        style={this.setStrikethrough(key)}
      />);
      return returnVal;
    });

    return widgetList;
  }

  addWidget(key) {
    // Check if the key is not already rendered


    if (this.state.layout.filter(widgetLayout => widgetLayout.i === key).length !== 0) {
      return;
    }
    // Check if the key is a valid widget that can be added
    if (Object.keys(Widgets).includes(key) === false) {
      return;
    }
    const newWidget = {
      i: key,
      x: (this.state.layout.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: Widgets[key].DefaultSize.w,
      h: Widgets[key].DefaultSize.h,
    };
    this.setState({
      // Add a new item. It must have a unique key!
      layout: [...this.state.layout, ...[newWidget]],
    });
  }

  editButtonClicked() {
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
    if (flipped === false && this.state.sideBarMenu === true) {
      this.setState({ sideBarMenu: false });
    }
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
          <AppBar style={styles.menuBarStyle} title="Settings" showMenuIconButton={false} />

          <List>
            <ListItem
              primaryText="Widget List"
              initiallyOpen
              primaryTogglesNestedList
              nestedItems={this.widgetsMenu()}
            />
            <Divider />
            <ListItem primaryText="Toggle Edit" onClick={this.editButtonClicked} rightIcon={this.state.editMode ? <EditorEdit /> : <ActionLockClosed />} />
            <Divider />
            <ListItem primaryText="Switch Theme" onClick={this.props.ThemeButton} />
            <Divider />
          </List>

        </Drawer>

        <FloatingActionButton style={styles.fixedToBottom} onClick={this.settingsButtonClicked}>
          <SettingIcon />
        </FloatingActionButton>
      </div>
  );
  }
}

export default Grid;


