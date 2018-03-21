import ReactGridLayout from 'react-grid-layout';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as gridActions from '../actions/gridActions';

// just for testing react-grid
const divStyle = {
  color: 'gray',
  fontWeight: 'bold',
  backgroundColor: 'coral',
};
class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridLayout: []
    }
  }

  componentDidMount() {
    this.props.dispatch(gridActions.updateGrid(this.state.gridLayout))
  }

  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      {
        i: 'a', x: 0, y: 0, w: 1, h: 2,
      },
      {
        i: 'b', x: 1, y: 0, w: 3, h: 2,
      },
      {
        i: 'c', x: 4, y: 0, w: 1, h: 2,
      },
    ];
    return (
      <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div style={divStyle} key="a">a</div>
        <div style={divStyle} key="b">b</div>
        <div style={divStyle} key="c">c</div>
      </ReactGridLayout>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    grid: state.gridLayout
  }
}
export default connect(mapStateToProps)(Grid);
