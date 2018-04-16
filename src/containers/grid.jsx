import React, { Component } from 'react';
import TodoList from './todoList';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';
import GridLayout, { WidthProvider, Responsive } from 'react-grid-layout';
//const ResponsiveReactGridLayout = WidthProvider(Responsive);



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
      layout: [0, 1, 2, 3].map((i, key, list) => ({
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2,
      })),
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
    // console.log("In onLayoutChange");
    this.setState({ layout });
  }

  editButtonClicked() {
    console.log('In editButtonClicked');
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
    //const updatedLayout = [...this.state.layout].map(widgetLayout => ({ ...widgetLayout, ...{ static: flipped } }));
    //this.setState({ layout: updatedLayout });
  }

  onRemoveItem(i) {
    console.log('removing', i);
    this.setState({ layout: _.reject(this.state.layout, { i }) });
  }

  /* 
  // this can be updated to match how we're now handling layout at the GridLayout component level
  // rather than inline in the div.

  createElement(el) {
    console.log('In createElement');
    console.log(el.static);
    // Inline style for X in top right corner of widgets
    const removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer',
    };
    const i = el.add ? '+' : el.i;
    return (
      <div style={divStyle} key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={this.onAddItem}
            title="You can add an item by clicking here, too."
          >
            Add +
          </span>
        ) : (
          <span className="text">{i}</span>
        )}
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
      </div>
    );
  }
  */

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
        h: 2
      }),
      // Increment the counter to ensure key is always unique.
      counter: this.state.counter + 1,
    });
  }

  onBreakpointChange(breakpoint, cols) {
    // console.log("In onBreakpointChange");
    this.setState({
      breakpoint,
      cols,
    });
  }

  render() {
    let appBar = this.state.editMode ?
      <AppBar
          style={appBarStyle}
          iconElementRight={<FlatButton label="Confirm" onClick={this.editButtonClicked} />}
      /> :
      <AppBar
            style={appBarStyle}
            iconElementRight={<FlatButton label="Edit" onClick={this.editButtonClicked} />}
      />;
    
    return (
      <div>
        {appBar}
        {this.state.editMode ? <button onClick={this.onAddItem}>Add Item</button> : null}
        <GridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          autoSize={true}
          width={1200}
          isDraggable={this.state.editMode}
          isResizable={this.state.editMode}
          {...this.props}
        >
          {this.state.layout.map(item => {
            return (<div style={divStyle} key={item.i}> {item.i} </div>)
          })}
        </GridLayout>
      </div>
    );
  }
}


export default Grid;
