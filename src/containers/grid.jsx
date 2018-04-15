import ReactGridLayout from 'react-grid-layout';
import React, { Component } from 'react';
import TodoList from './todoList';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';

const appBarStyle = {
  backgroundColor: 'gray',
};
// just for testing react-grid
const divStyle = {
  color: 'gray',
  fontWeight: 'bold',
  backgroundColor: 'coral',
};

const removeStyle = {
  position: 'absolute',
  right: '2px',
  top: 0,
  cursor: 'pointer',
};

class Grid extends Component {
  constructor(props) {
    super(props);
    // console.log(this.editMode);
    this.editButtonClicked = this.editButtonClicked.bind(this),
    this.onLayoutChange = this.onLayoutChange.bind(this),
    this.state = {
      editMode: false,
      // initializing states for widgets
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
      ],
    };
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
    // console.log('In componentWillUnMount');
    localStorage.setItem(this.state.storageKey, JSON.stringify(this.state));
    /* global window */
    window.removeEventListener('beforeunload', this.componentDidUpdate);
  }

  onLayoutChange(layout) {
    this.setState({ layout });
  }
  editButtonClicked() {
    // console.log('In editButtonClicked');
    const flipped = !this.state.editMode;
    this.setState({ editMode: flipped });
    const updatedLayout = [...this.state.layout].map(widgetLayout => ({ ...widgetLayout, ...{ static: flipped } }));
    this.setState({ layout: updatedLayout });
  }

  onRemoveItem(key) {
    // console.log('removing', key);
    this.setState({ layout: _.reject(this.state.layout, { i: key }) });
  }

  render() {
    // console.log('render');
    // console.log(this);
    if (this.state.layout[0].static == true) {
      return (
        <div>
          <AppBar style={appBarStyle} iconElementRight={<FlatButton label="Edit" onClick={this.editButtonClicked} />} />
          <ReactGridLayout className="layout" onLayoutChange={this.onLayoutChange} draggableCancel="input,textarea" layout={this.state.layout} cols={12} rowHeight={30} width={1200}>
            <div key="a"><TodoList /></div>
            <div style={divStyle} key="b">b</div>
            <div style={divStyle} key="c">c</div>
          </ReactGridLayout>
        </div>
      );
    }

    return (
      <div>
        <AppBar style={appBarStyle} iconElementRight={<FlatButton label="Confirm" onClick={this.editButtonClicked} />} />
        <ReactGridLayout className="layout" onLayoutChange={this.onLayoutChange} draggableCancel="input,textarea" layout={this.state.layout} cols={12} rowHeight={30} width={1200}>
          <div key="a"><TodoList />
            <span
              className="remove"
              style={removeStyle}
              onClick={this.onRemoveItem.bind(this, 'a')}
            >X
            </span>
          </div>
          <div style={divStyle} key="b">b
            <span
              className="remove"
              style={removeStyle}
              onClick={this.onRemoveItem.bind(this, 'b')}
            >X
            </span>
          </div>
          <div style={divStyle} key="c">c
            <span
              className="remove"
              style={removeStyle}
              onClick={this.onRemoveItem.bind(this, 'c')}
            >X
            </span>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}


export default Grid;
