import React from 'react';
import Grid from '../src/containers/grid';
import { Drawer, List, ListItem, Paper, Tabs, Tab, Subheader, ContentAdd, TextField } from 'material-ui';
import Todo from './../src/components/Todo/todo';
import TodoItem from './../src/components/Todo/todoItem';
import Bookmarker from './../src/components/bookmarker';

/* Testing the Grid Component */
/* Unit Tests */
describe('<Grid />', () => {
    it('edit button clicked changes state', () => {
      const wrapper = shallow(<Grid />);
      //List Item at(1) is the editButton in the drawer
      console.log(wrapper.find(Drawer).find(ListItem));
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
describe('<Todo />', () => {
  it('add a Todo item', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addTodo("test Todo item");
    expect(wrapper.state().todos.length).toEqual(1);
  });
  it('onEdit corrctly turns on editing for a Todo item', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addTodo("test Todo item");
    const beforeEdit = wrapper.state().editing;
    wrapper.instance().onEdit(wrapper.state().todos[0]);
    const afterEdit = wrapper.state().editing;
    expect(beforeEdit).toEqual(null);
    expect(afterEdit).toEqual(wrapper.state().todos[0].id);
  });
  it('onDelete correctly deletes a Todo item', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addTodo("test Todo item");
    const beforeDelete = wrapper.state().todos.length;
    wrapper.instance().onDelete(wrapper.state().todos[0]);
    const afterDelete = wrapper.state().todos.length;
    expect(beforeDelete).toEqual(1);
    expect(afterDelete).toEqual(0);
  });
  it('onToggle correctly changes completed state', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addTodo("test Todo item");
    const newTodo = wrapper.state().todos[0].completed;
    wrapper.instance().onToggle(wrapper.state().todos[0]);
    const completeTodo = wrapper.state().todos[0].completed;
    wrapper.instance().onToggle(wrapper.state().todos[0]);
    const undoComplete = wrapper.state().todos[0].completed;
    expect(newTodo).toEqual(false);
    expect(completeTodo).toEqual(true);
    expect(undoComplete).toEqual(false);
  })
  it('complete a Todo item', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addTodo("test Todo item");
    console.log(wrapper.find(Tabs).find(Tab).at(0).find(List).find(TodoItem).at(0));
    wrapper.find(Tabs).find(Tab).at(0).find(List).find(TodoItem).at(1).simulate('click');
    expect(wrapper.state().todos[0].completed).toEqual(true);
  });
});

/* Bookmarker */
describe('<Bookmarker />', () => {
  it('add a quick link', () => {
    const wrapper = shallow(<Bookmarker />);
    console.log(wrapper);
    wrapper.find(ContentAdd).at(0).simulate('click');
    wrapper.find(TextField).at(0).onInput="test";
    wrapper.find(TextField).at(1).onInput="google.com";
  });
});
/********************************/