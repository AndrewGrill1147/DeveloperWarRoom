import React from 'react';
import Grid from '../src/containers/grid';
import { Drawer, ListItem } from 'material-ui';

/* Testing the Grid Component */
/* Unit Tests */
describe('<Grid />', () => {
    it('edit button clicked changes state', () => {
      const wrapper = shallow(<Grid />);
      //List Item at(1) is the editButton in the drawer
      wrapper.find(Drawer).find(ListItem).at(1).simulate('click');
      expect(wrapper.state().editMode).toEqual(true);      
    });
    it('cannot add the same widget twice', () => {
     const wrapper = shallow(<Grid />);
     wrapper.instance().addWidget("key");
     wrapper.instance().addWidget("key");
     expect(wrapper.state().layout.length).toEqual(1);
    });
    it('adding widget needs to be in widget list', () => {
      const wrapper = shallow(<Grid />);
      wrapper.instance().addWidget("NOT A VALID KEY");
      expect(wrapper.state().layout.length).toEqual(0);
    });
    it('doesnt try and remove the widget if its not in layout', () => {
      const wrapper = shallow(<Grid />);
      wrapper.instance().addWidget("key");
      wrapper.instance().onRemoveItem("NOT A VALID KEY");
      expect(wrapper.state().layout.length).toEqual(1);
    });
    it('elementInArray function returning correct values', () => {
      const wrapper = shallow(<Grid />);
      wrapper.instance().addWidget("key");
      wrapper.instance().addWidget("key 2");
      const found1 = wrapper.instance().elementinArray("key");
      const found2 = wrapper.instance().elementinArray("NOT A VALID KEY");
      expect(found1).toEqual(true);
      expect(found2).toEqual(false);
    });
  });

/* Integration Tests */
/* TODO */

/********************************/