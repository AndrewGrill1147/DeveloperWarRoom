import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import _ from 'lodash';
import GridLayout, { WidthProvider, Responsive } from 'react-grid-layout';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper';
import { SettingsIcon, ActionCheckCircle } from './icon';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import Toggle from 'material-ui/Toggle';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';

/* const SettingsMenu = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton ><MoreVertIcon /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem primaryText="Edit Widgets" />
    <MenuItem primaryText="Change Theme" />
    <MenuItem primaryText="Add Widgets" />
  </IconMenu>
); */

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
  backgroundColor: 'blue',

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
    this.editButtonClicked = this.editButtonClicked.bind(this),
    this.onLayoutChange = this.onLayoutChange.bind(this),
    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.menuOptions = this.menuOptions.bind(this);
    this.createMenuElement = this.createMenuElement.bind(this);
    this.elementinArray = this.elementinArray.bind(this);
    // I think I need this inline so I can work with the current object along with modularity for render function
    this.SettingsMenu = props => (
      <IconMenu
        {...props}
        iconButtonElement={
          <IconButton ><MoreVertIcon /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        onItemClick={this.menuOptions}
      >
        <MenuItem primaryText="Edit Widgets" />
        <MenuItem primaryText="Change Theme" />
        <MenuItem primaryText="Add Widgets" />
      </IconMenu>
    );

    this.state = {
      editMode: false,
      sideBarMenu: false,
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

  editButtonClicked() {
    console.log('In editButtonClicked');
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
    if (flipped == false && this.state.sideBarMenu == true) {
      this.setState({ sideBarMenu: false });
    }
  }

  onRemoveItem(i) {
    console.log('removing', i);
    this.setState({ layout: _.reject(this.state.layout, { i }) });
  }

  createElement(element) {
    console.log('In createElement');
    const removeButton = this.state.editMode ?
      (<span
        className="remove"
        style={removeStyle}
        onClick={this.onRemoveItem.bind(this, element.i)}
      >
        <RemoveIcon color="grey" />
       </span>)
      : null;
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
    for (let i = 0; i < this.state.layout.length; ++i) {
      if (this.state.layout[i].i == key) {
        return true;
      }
    }
    return false;
  }

  onAddItem(key) {
    /* eslint no-console: 0 */
    // return 0;
    if (this.elementinArray(key) == false) {
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
      case 'Add Widgets':
        this.editButtonClicked();
        const flipped = !this.state.sideBarMenul;
        this.setState({ sideBarMenu: flipped });
        break;
      default: null;
    }
  }

  createMenuElement(element) {
    return (
      <div key={element.i} data-grid={element}>
        <List >
          <ListItem primaryText={element.i} onClick={() => this.onAddItem(element.i)} />
        </List>
      </div>
    );
  }

  render() {
    console.log('In render function');
    console.log(this);
    const appBar = this.state.editMode ?
      (<AppBar
        style={appBarStyle}
        showMenuIconButton={false}
        iconElementRight={<FlatButton icon={<ActionCheckCircle />} onClick={this.editButtonClicked} />}
      />) :
      (<AppBar
        style={appBarStyle}
        showMenuIconButton={false}
        iconElementRight={<this.SettingsMenu />}
      />);

    return (
      <div>
        {appBar}
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
        {this.state.sideBarMenu && this.state.editMode ? 
          (<Drawer open={this.state.sideBarOpen} width={200}>
          <AppBar style={menuBarStyle} title="Widgets" showMenuIconButton={false} />
          {this.state.allWidgets.map(element => this.createMenuElement(element))}
          </Drawer>) : null}
      </div>
    );
  }
}


export default Grid;
