import React from 'react';
import Grid from '../src/containers/grid';
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
    wrapper.instance().addWidget('Reddit');
    const found1 = wrapper.instance().elementinArray('Reddit');
    const found2 = wrapper.instance().elementinArray('NOT A VALID KEY');
    expect(found1).toEqual(true);
    expect(found2).toEqual(false);
  });
  it('removes widget if its in the list', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('Reddit');
    expect(wrapper.state().layout.length).toEqual(1);
    wrapper.instance().onRemoveItem('Reddit');
    expect(wrapper.state().layout.length).toEqual(0);
  });
  
  it('widget default sizes are accurate', () => {
    const wrapper = shallow(<Grid />);
    wrapper.instance().addWidget('Reddit ');
    wrapper.instance().addWidget('Todo List');
    wrapper.instance().addWidget('Pull Request');
    expect(Widgets['Reddit '].DefaultSize.w).toEqual(3);
    expect(Widgets['Reddit '].DefaultSize.h).toEqual(3);
    expect(Widgets['Todo List'].DefaultSize.w).toEqual(2.5);
    expect(Widgets['Todo List'].DefaultSize.h).toEqual(2.5);
    expect(Widgets['Pull Request'].DefaultSize.w).toEqual(4);
    expect(Widgets['Pull Request'].DefaultSize.h).toEqual(2);
  });
});


