import React from 'react';
import Grid from '../src/components/Grid';
import { Drawer, ListItem } from 'material-ui';


/* Testing the Grid Component */
describe('<Grid />', () => {
  it('edit button clicked changes state', () => {
    const wrapper = shallow(<Grid />);
    // List Item at(1) is the editButton in the drawer
    wrapper.find(Drawer).find(ListItem).at(1).simulate('click');
    expect(wrapper.state().editMode).toEqual(true);
  });
  it('cannot add the same widget twice', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('Todo List');
    wrapper.instance().addWidget('Todo List');
    expect(wrapper.state().layout.length).toEqual(1);
  });
  it('adding widget needs to be in widget list', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('NOT A VALID KEY');
    expect(wrapper.state().layout.length).toEqual(0);
  });
  it('doesnt try and remove the widget if its not in layout', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('Todo List');
    wrapper.instance().onRemoveItem('NOT A VALID KEY');
    expect(wrapper.state().layout.length).toEqual(1);
  });
  it('elementInArray function returning correct values', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('Todo List');
    const found1 = wrapper.instance().componentInGrid('Todo List');
    const found2 = wrapper.instance().componentInGrid('NOT A VALID KEY');
    expect(found1).toEqual(true);
    expect(found2).toEqual(false);
  });
  it('removes widget if its in the list', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('Github');
    expect(wrapper.state().layout.length).toEqual(1);
    wrapper.instance().onRemoveItem('Github');
    expect(wrapper.state().layout.length).toEqual(0);
  });
});


