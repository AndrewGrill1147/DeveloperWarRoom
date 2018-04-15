import ReactGridLayout from 'react-grid-layout';
import React, { Component } from 'react';
import TodoList from './todoList';
import RaisedButton from 'material-ui/RaisedButton';
import ExampleLayout from './testHook';
import RGL, { WidthProvider } from "react-grid-layout";
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const appBarStyle = {
  backgroundColor: 'gray',
};
// just for testing react-grid
const divStyle = {
  color: 'gray',
  fontWeight: 'bold',
  backgroundColor: 'coral',
};

class Grid extends Component {
  constructor(props) {
    super(props);
    console.log(this.editMode);
    this.editButtonClicked = this.editButtonClicked.bind(this),
    this.onLayoutChange = this.onLayoutChange.bind(this),
    this.state = { 
      editMode: false,
      //initializing states for widgets
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

  onLayoutChange(layout) {
    this.setState({layout: layout});
  }

  editButtonClicked() {
    console.log("In editButtonClicked");
    const flipped = !this.state.editMode;
    this.setState({editMode: flipped});
    let updatedLayout = [...this.state.layout].map( widgetLayout => {
      return {...widgetLayout, ...{static: flipped}};
    });
    this.setState( {layout: updatedLayout});
  }
  
  componentDidMount() {
    /* global localStorage */
    const savedState = localStorage.getItem(this.state.storageKey);
    if (savedState !== null) {
      /* eslint-disable-next-line */
      this.setState(JSON.parse(savedState));
      this.state.storageKey = JSON.parse(savedState);
    }
    /* global window */
    window.addEventListener('beforeunload', this.componentWillUnmount);
  }

  componentWillUnmount() {
    /* global localStorage */
    console.log("In componentWillUnMount");
    localStorage.setItem(this.state.storageKey, JSON.stringify(this.state));
    /* global window */
    window.removeEventListener('beforeunload', this.componentDidUpdate);
  }

  render() {
    //console.log('render');
    //console.log(this);
    if(this.state.layout[0].static == true)
    {
      return (
        <div>
        <AppBar style={appBarStyle} iconElementRight={<FlatButton label="Edit" onClick={this.editButtonClicked} />} />
        <ReactGridLayout className="layout" onLayoutChange={this.onLayoutChange} draggableCancel="input,textarea" layout={this.state.layout} cols={12} rowHeight={30} width={1200}>
          <div key="a"><TodoList/></div>
          <div style={divStyle} key="b">b</div>
          <div style={divStyle} key="c">c</div>
        </ReactGridLayout>
        </div>
      );
    }
    else {
      return (
        <div>
        <AppBar style={appBarStyle} iconElementRight={<FlatButton label="Confirm" onClick={this.editButtonClicked} />} />
        <ReactGridLayout className="layout" onLayoutChange={this.onLayoutChange} draggableCancel="input,textarea" layout={this.state.layout} cols={12} rowHeight={30} width={1200}>
          <div key="a"><TodoList/></div>
          <div style={divStyle} key="b">b</div>
          <div style={divStyle} key="c">c</div>
        </ReactGridLayout>
        </div>
      );
    }
    
  }
}


export default Grid;
