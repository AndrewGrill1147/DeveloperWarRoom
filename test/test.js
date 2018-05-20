import React from 'react';
import Grid from '../src/containers/grid';
import { Drawer, ListItem, Dialog, TextField } from 'material-ui';
import Bookmarker from '../src/components/bookmarker';
import IconButton from 'material-ui/IconButton/IconButton';

/* Testing the Grid Component */
/* Unit Tests */
describe('<Grid />', () => {
  it('edit button clicked changes state', () => {
    const wrapper = shallow(<Grid />);
    // List Item at(1) is the editButton in the drawer
    wrapper.find(Drawer).find(ListItem).at(1).simulate('click');
    expect(wrapper.state().editMode).toEqual(true);
  });
  it('cannot add the same widget twice', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('key');
    wrapper.instance().addWidget('key');
    expect(wrapper.state().layout.length).toEqual(1);
  });
  it('adding widget needs to be in widget list', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('NOT A VALID KEY');
    expect(wrapper.state().layout.length).toEqual(0);
  });
  it('doesnt try and remove the widget if its not in layout', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('key');
    wrapper.instance().onRemoveItem('NOT A VALID KEY');
    expect(wrapper.state().layout.length).toEqual(1);
  });
  it('elementInArray function returning correct values', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('key');
    wrapper.instance().addWidget('key 2');
    const found1 = wrapper.instance().elementinArray('key');
    const found2 = wrapper.instance().elementinArray('NOT A VALID KEY');
    expect(found1).toEqual(true);
    expect(found2).toEqual(false);
  });

  it('removes widget if its in the list', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('key');
    expect(wrapper.state().layout.length).toEqual(1);
    wrapper.instance().onRemoveItem('key');
    expect(wrapper.state().layout.length).toEqual(0);
  });
});

describe('<Bookmarker />', () => {
  it('add bookmark button changes state', () => {
    const wrapper = shallow(<Bookmarker />);
    wrapper.find(IconButton).simulate('click');
    expect(wrapper.state().dialogOpen).toEqual(true);
  });
/*
  it('add a bookmark', () => {
    const wrapper = shallow(<Bookmarker />);
    wrapper.find(Dialog).at(1).find(TextField).simulate('input');
    wrapper.find(Dialog).at(2).find(TextField).simulate('input');
    expect(wrapper.state().dialogOpen).toEqual(true);
  }); */
});


/* Integration Tests */
/* TODO */

/** ***************************** */
