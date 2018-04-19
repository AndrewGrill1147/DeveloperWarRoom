import React, { Component } from 'react';
import TodoList from './todoList';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import _ from 'lodash';
import GridLayout, { WidthProvider, Responsive } from 'react-grid-layout';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper';

// const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
    this.state = {
      editMode: false,
      counter: 4,
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
      /* {
        i: "Pull Requests", x: 0, y: 0, w: 2, h: 2,
        i: "Todo List", x: 2, y: 0, w: 2, h: 2,
        i: "Reddit", x: 4, y: 0, w: 2, h: 2,
        i: "Stack Overflow", x: 6, y: 0, w: 2, h: 2,
      } */
      /* layout: [0, 1, 2, 3].map((i, key, list) => ({
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2,
      })), */
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

    if (removeButton) {
      console.log('added a remove button');
    }

    return (
      <div key={element.i} data-grid={element}>
        <Paper style={style} zDepth={3}>
          <span className="text">{element.i}</span>
          {removeButton}
        </Paper>
      </div>
    );
  }


  onAddItem() {
    /* eslint no-console: 0 */
    console.log('adding', 'n', this.state.counter);
    this.setState({
      // Add a new item. It must have a unique key!
      layout: this.state.layout.concat({
        i: `${this.state.counter}`,
        x: (this.state.layout.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
      }),
      // Increment the counter to ensure key is always unique.
      counter: this.state.counter + 1,
    });
  }

  onBreakpointChange(breakpoint, cols) {
    console.log('In onBreakpointChange');
    this.setState({
      breakpoint,
      cols,
    });
  }

  render() {
    console.log('In render function');
    console.log(this);
    const appBar = this.state.editMode ?
      (<AppBar
        style={appBarStyle}
        iconElementRight={<FlatButton label="Confirm" onClick={this.editButtonClicked} />}
      />) :
      (<AppBar
        style={appBarStyle}
        iconElementRight={<FlatButton label="Edit" onClick={this.editButtonClicked} />}
      />);

    return (
      <div>
        {appBar}
        {this.state.editMode ? <button onClick={this.onAddItem}>Add Item</button> : null}
        <GridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          autoSize
          width={1200}
          isDraggable={this.state.editMode}
          isResizable={this.state.editMode}
          {...this.props}
        >
          {this.state.layout.map(element => this.createElement(element))}
        </GridLayout>
      </div>
    );
  }
}


export default Grid;
