import React from 'react';
import Todo from '../src/components/Todo';

/* Testing the Todo Component */
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
  });
});