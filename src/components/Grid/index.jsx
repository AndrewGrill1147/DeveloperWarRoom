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
  gridItemPaperStyle: {
    height: '100%',
    width: '100%',
    margin: '0px',
    textAlign: 'left',
    display: 'inline-block',
  },
  menuBarStyle: {
    backgroundColor: 'rgb(0, 188, 212)',
  },
  gridItem: {
    // TODO?
    // overflow: 'auto',
  },
};

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: 20,
      rowHeight: 20,
      gridWidth: 1000,
      editMode: false,
      sideBarMenu: false,
      sideBarOpen: false,
      layout: [],
      storageKey: this.constructor.name,
    };

    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.componentInGrid = this.componentInGrid.bind(this);
    this.onSettingsButtonClick = this.onSettingsButtonClick.bind(this);
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
    // ?
    const layout = [...newLayout];
    LocalStorageAPI.put(this.state.storageKey, layout);
    this.setState({ layout });
  }

  onSettingsButtonClick() {
    const opened = !this.state.sideBarOpen;
    this.setState({ sideBarOpen: opened });
  }

  onEditButtonClick() {
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
    if (flipped === false && this.state.sideBarMenu === true) {
      this.setState({ sideBarMenu: false });
    }
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
      <div style={styles.gridItem} key={element.i}>
        <Paper style={styles.gridItemPaperStyle} zDepth={3}>
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
        disabled={this.componentInGrid(key)}
        onClick={() => { this.addWidget(key); }}
        style={this.setStrikethrough(key)}
      />);
      return returnVal;
    });

    return widgetList;
  }

  addWidget(key) {
    // Check if the component is already in the grid, and that the key exists
    if (this.componentInGrid(key) || !Object.keys(Widgets).includes(key)) {
      return;
    }
    const defaultWidgetLayout = {
      x: 0,
      y: Infinity,
      w: 3,
      h: 3,
      minW: 1,
      minH: 1,
    };
    const widget = { ...defaultWidgetLayout, ...Widgets[key].layout, ...{ i: key } };

    // add new widget first, s.t. its {x,y} pos is prioritized above all else
    this.setState({
      layout: [...[widget], ...this.state.layout],
    });
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
        <GridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          autoSize
          isDraggable={this.state.editMode}
          isResizable={this.state.editMode}
          width={this.state.gridWidth}
          cols={this.state.cols}
          rowHeight={this.state.rowHeight}
          {...this.props}
        >
          {this.state.layout.map(element => this.createElement(element))}
        </GridLayout>

        <Drawer open={this.state.sideBarOpen} width={200}>
          {this.renderSettingsDrawer()}
        </Drawer>

        <FloatingActionButton style={styles.fixedToBottom} onClick={this.onSettingsButtonClick}>
          <SettingIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

/* garbage

        <div style={styles.horizontalHeaderBarStyle}>
          <Paper zDepth={2}>
            <Bookmarker />
          </Paper>
        </div>
  */

export default Grid;

