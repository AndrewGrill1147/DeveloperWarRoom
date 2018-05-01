import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import _ from 'lodash';
import GridLayout from 'react-grid-layout';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import { ActionCheckCircle } from './icon';
import Bookmarker from './../components/bookmarker';
import SettingIcon from 'material-ui/svg-icons/action/settings';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { FlatButton, RaisedButton } from 'material-ui';
import Widgets from './widgets';

const fixedToBottom = {
  position: 'fixed',
  bottom: '0',
  right: '0',
  margin: '10px',
};
const removeStyle = {
  position: 'absolute',
  right: '2px',
  top: 0,
  cursor: 'pointer',
};

const removeIconSize = {
  width: 20,
  height: 20,
};
const horizontalHeaderBarStyle = {
  display: 'inline',
  whiteSpace: 'nowrap',
};
const iconAlignment = {
  position: 'fixed',
  top: '0',
  right: '0',
  marginTop: '8px',
};
const style = {
  height: '100%',
  width: '100%',
  textAlign: 'left',
  display: 'inline-block',
};

const RemoveIcon = props => (
  <IconButton iconStyle={removeIconSize}>
    <ActionDelete {...props} />
  </IconButton>
);

const appBarStyle = {
  backgroundColor: 'gray',
};
const menuBarStyle = {
  backgroundColor: 'rgb(0, 188, 212)',
};
// just for testing react-grid
const divStyle = {
  color: 'gray',
  fontWeight: 'bold',
  backgroundColor: 'coral',
};

const defaultProps = {
  className: 'layout',
  cols: {
    lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
  },
  rowHeight: 100,
};

class Grid extends Component {
  constructor(props) {
    super(props);
    this.editButtonClicked = this.editButtonClicked.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.menuOptions = this.menuOptions.bind(this);
    this.createMenuElement = this.createMenuElement.bind(this);
    this.elementinArray = this.elementinArray.bind(this);
    this.settingsButtonClicked = this.settingsButtonClicked.bind(this);

    this.state = {
      editMode: false,
      sideBarMenu: false,
      sideBarOpen: false,
      // Every possible widget
      allWidgets: [{
        i: 'Pull Requests',
      },
      {
        i: 'Todo List',
      },
      {
        i: 'Reddit',
      },
      {
        i: 'Stack Overflow',
      }],

      // Default view when user first opens chrome extension
      layout: [{
        i: 'Pull Requests', x: 0, y: 0, w: 2, h: 2,
      },
      {
        i: 'Todo List', x: 2, y: 0, w: 2, h: 2,
      },
      {
        i: 'Reddit', x: 4, y: 0, w: 2, h: 2,
      },
      {
        i: 'Stack Overflow', x: 6, y: 0, w: 2, h: 2,
      },

      ],
    };
  }

  componentDidMount() {
    console.log('In componentDidMount');
  }


  componentWillUnmount() {
    // global localStorage
    console.log('In componentWillUnMount');
  }

  onLayoutChange(layout) {
    console.log('In onLayoutChange');
    this.setState({ layout });
  }

  settingsButtonClicked() {
    const opened = !this.state.sideBarOpen;
    this.setState({ sideBarOpen: opened });
  }

  editButtonClicked() {
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
  }

  onRemoveItem(i) {
    console.log('removing', i);
    this.setState({ layout: _.reject(this.state.layout, { i }) });
  }

  createElement(element) {
    console.log('In createElement');
    const removeButton = this.state.editMode ?
      (
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, element.i)}
        >
          <RemoveIcon color="grey" />
        </span>
      ) : null;
    return (
      <div key={element.i} data-grid={element}>
        <Paper style={style} zDepth={3}>

          <span className="text">{element.i}</span>
          {removeButton}
        </Paper>
      </div>
    );
  }

  elementinArray(key) {
    for (let i = 0; i < this.state.layout.length; i += 1) {
      if (this.state.layout[i].i === key) {
        return true;
      }
    }
    return false;
  }

  onAddItem(key) {
    /* eslint no-console: 0 */
    // return 0;
    if (this.elementinArray(key) === false) {
      console.log('Key not in layout, adding to list');
      this.setState({
      // Add a new item. It must have a unique key!
        layout: this.state.layout.concat({
          i: key,
          x: (this.state.layout.length * 2) % (this.state.cols || 12),
          y: Infinity, // puts it at the bottom
          w: 2,
          h: 2,
        }),
      });
    } else {
      console.log('Key in layout. NOT ADDING TO LIST');
    }
  }


  onBreakpointChange(breakpoint, cols) {
    console.log('In onBreakpointChange');
    this.setState({
      breakpoint,
      cols,
    });
  }

  menuOptions(e, key, menuItem) {
    console.log('In menuOptions');
    switch (key.props.primaryText) {
      case 'Edit Widgets':
        this.editButtonClicked();
        break;
      case 'Change Theme': // Not Working this.props.ThemeButton; break;
        this.props.ThemeButton();
        break;
      case 'Add Widgets': {
        this.editButtonClicked();
        const flipped = !this.state.sideBarMenul;
        this.setState({ sideBarMenu: flipped });
        break;
      }
      default:
    }
  }

  widgetsMenu() {
    const app = Object.keys(Widgets).map((key) => {
      console.log('widgets menu key ', key);
      return <ListItem key={key} primaryText={key} onClick={() => { alert(key); }} />;
    });

    return app;
  }

  addWidget(key) {
    // TODO: Need to fix the add widget function
    const newWidget = {
      i: key,
      x: (this.state.layout.length * 2) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 2,
      h: 2,
    };
    this.setState({
      // Add a new item. It must have a unique key!
      layout: [...this.state.layout, ...[newWidget]],
    });
  }

  createMenuElement(element) {
    return (
      <div key={element.i} data-grid={element}>
        <ListItem primaryText={element.i} onClick={() => this.onAddItem(element.i)} />
      </div>
    );
  }

  render() {
    console.log('In render function');
    console.log(this);

    return (
      <div>
        <Paper zDepth={2}>
          <div style={horizontalHeaderBarStyle}>
            <Bookmarker />
          </div>
        </Paper>
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
          <AppBar style={menuBarStyle} title="Widgets" showMenuIconButton={false} />

          <List>
            <ListItem
              primaryText="Widget List"
              initiallyOpen
              primaryTogglesNestedList
              nestedItems={this.widgetsMenu()}
            />
            <Divider />
            <ListItem primaryText="Toggle Edit" onClick={this.editButtonClicked} />
            <Divider />
            <ListItem primaryText="Switch Theme" onClick={this.props.ThemeButton} />
            <Divider />
          </List>

        </Drawer>

        <FloatingActionButton style={fixedToBottom} onClick={this.settingsButtonClicked}>
          <SettingIcon />
        </FloatingActionButton>
      </div>
    );
  }
}


export default Grid;
