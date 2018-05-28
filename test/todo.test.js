import React from 'react';
import Todo from '../src/components/Todo';

/* Testing the Todo Component */
describe('<Todo />', () => {
  it('add a Todo item', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addTodo("test Todo item");
    expect(wrapper.state().todos.length).toEqual(1);
  });
  it('add a group', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addGroup("My Todo Group");
    expect(wrapper.state().groupList.length).toEqual(2);
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
  // onEditGroup(editGroup)
  it('onEditGroup corrctly turns on editing for a Group', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addGroup("My Group Test");
    const beforeEdit = wrapper.state().editing;
    wrapper.instance().onEditGroup(wrapper.state().groupList[1]);
    const afterEdit = wrapper.state().editingGroup;
    expect(beforeEdit).toEqual(null);
    expect(afterEdit).toEqual(wrapper.state().groupList[1].id);
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
  it('delete a group', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addGroup("My Todo Group");
    const beforeDelete = wrapper.state().groupList.length;
    const assignedId = wrapper.state().groupList[1].id;
    wrapper.instance().deleteGroup(assignedId);
    const afterDelete = wrapper.state().groupList.length;
    expect(beforeDelete).toEqual(2);
    expect(afterDelete).toEqual(1);
  });
  it('onToggle correctly changes ToDo completed state', () => {
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
  // handleGroupChange(event, index, value)
  /*it('onToggle correctly changes Group name', () => {
    const wrapper = shallow(<Todo />);
    wrapper.instance().addGroup("Test Group");
    const newGroup = wrapper.state().groupList[1].name;
    console.log(newGroup);
    const newGroupId = wrapper.state().groupList[1].id;
    console.log(newGroupId);
    wrapper.state().editingGroup = newGroupId;
    wrapper.instance().onEditGroup(wrapper.state().groupList[1]);
    wrapper.instance().onSaveGroup("New Test Group Name");
    const resultGroupName = wrapper.state().groupList[1].name;
    console.log(resultGroupName);
    expect(resultGroupName).toEqual("New Test Group Name");
  }); */
});