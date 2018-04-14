import ReactGridLayout from 'react-grid-layout';
import React, { Component } from 'react';
import TodoList from './todoList';

// just for testing react-grid
const divStyle = {
  color: 'gray',
  fontWeight: 'bold',
  backgroundColor: 'coral',
};
{/*const layout = [
  {
    i: 'a', x: 0, y: 0, w: 3, h: 5, minH: 5, minW: 3,
  },
  {
    i: 'b', x: 1, y: 0, w: 3, h: 5, minH: 5, minW: 3,
  },
  {
    i: 'c', x: 4, y: 0, w: 3, h: 5, minH: 5, minW: 3,
  },
];*/}
class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      layout: [
        {
          i: 'a', x: 0, y: 0, w: 3, h: 5, minH: 5, minW: 3,
        },
        {
          i: 'b', x: 1, y: 0, w: 3, h: 5, minH: 5, minW: 3,
        },
        {
          i: 'c', x: 4, y: 0, w: 3, h: 5, minH: 5, minW: 3,
        },
      ]
    };
  }
  render() {
    return (
      <ReactGridLayout className="layout" draggableCancel="input,textarea" layout={this.state.layout} cols={12} rowHeight={30} width={1200}>
        <div style={divStyle} key="a">a</div>
        <div style={divStyle} key="b">b</div>
        <div style={divStyle} key="c">c</div>
      </ReactGridLayout>
    );
  }
}

export default Grid;
