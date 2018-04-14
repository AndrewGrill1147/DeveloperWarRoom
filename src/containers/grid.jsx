import ReactGridLayout from 'react-grid-layout';
import React, { Component } from 'react';
import TodoList from './todoList';
import RaisedButton from 'material-ui/RaisedButton';

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
    console.log(this.editMode);
    editButtonClicked: this.editButtonClicked.bind(this),
    this.state = { 

      editMode: true,
      layout: [
        {
          i: 'a', x: 0, y: 0, w: 3, h: 5, minH: 5, minW: 3, static: true,
        },
        {
          i: 'b', x: 1, y: 0, w: 3, h: 5, minH: 5, minW: 3, static: true,
        },
        {
          i: 'c', x: 4, y: 0, w: 3, h: 5, minH: 5, minW: 3, static: true,
        },
      ]
    };
  }

  editButtonClicked() {
    console.log("In editButtonClicked");
    console.log(this.state.editMode);
    {/*this.setState({ editMode: !this.state.editMode})*/}
    this.setState({ layout: 
    [
      {
        i: 'a', x: 0, y: 0, w: 3, h: 5, minH: 5, minW: 3, static: this.state.editMode,
      },
      {
        i: 'b', x: 1, y: 0, w: 3, h: 5, minH: 5, minW: 3, static: this.state.editMode,
      },
      {
        i: 'c', x: 4, y: 0, w: 3, h: 5, minH: 5, minW: 3, static: this.state.editMode,
      },
    ] });
  }
  
  componentDidMount() {
    /* global localStorage */
    console.log("In componentDidMount");
    console.log(this.state.editMode);

    //const savedState = localStorage.getItem(this.state.storageKey);
    //if (savedState !== null) {
      /* eslint-disable-next-line */
      //this.setState(JSON.parse(savedState));
      // this.state.storageKey = JSON.parse(savedState);
    //}
    /* global window */
    //window.addEventListener('beforeunload', this.componentWillUnmount);
  }

  componentWillUnmount() {
    /* global localStorage */
    console.log("In componentWillMount");
    localStorage.setItem(this.state.storageKey, JSON.stringify(this.state));
    /* global window */
    window.removeEventListener('beforeunload', this.componentDidUpdate);
  }

  render() {
    return (
      <div>
      <RaisedButton onClick={this.editButtonClicked} label="Edit" />
      <ReactGridLayout className="layout" draggableCancel="input,textarea" layout={this.state.layout} cols={12} rowHeight={30} width={1200}>
        <div style={divStyle} key="a">a</div>
        <div style={divStyle} key="b">b</div>
        <div style={divStyle} key="c">c</div>
      </ReactGridLayout>
      </div>
    );
  }
}

export default Grid;
