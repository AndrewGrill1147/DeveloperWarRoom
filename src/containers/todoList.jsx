import React, { Component } from 'react';
import { grey400 } from 'material-ui/styles/colors';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = { addInput: '', taskList: [] };
    this.addTask = this.addTask.bind(this);
    this.addButtonClicked = this.addButtonClicked.bind(this);
    this.updateAddInput = this.updateAddInput.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.listMapping = this.listMapping.bind(this);
  }
  rightIconMenu(listValue) {
    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={evt => this.moveItem(evt, listValue)}>Move</MenuItem>
        <MenuItem onClick={evt => this.deleteItem(evt, listValue)}>Delete</MenuItem>
      </IconMenu>
    );
  }
  moveItem(evt, listValue) {
    let newState = 'todo';
    if (listValue.state === 'todo') {
      newState = 'in progress';
    }
    if (listValue.state === 'in progress') {
      newState = 'done';
    }
    if (listValue.state === 'done') {
      newState = 'done';
    }
    const taskIndex = this.state.taskList.findIndex(task => task.id === listValue.id);
    const newTaskList = this.state.taskList;
    newTaskList[taskIndex].state = newState;
    this.setState({ taskList: newTaskList });
  }
  deleteItem(evt, listValue) {
    const newTaskList = this.state.taskList.filter(task => task.id !== listValue.id);
    this.setState({ taskList: newTaskList });
  }
  listMapping(listValue) {
    return (
      <ListItem
        primaryText={listValue.text}
        secondaryText={listValue.time}
        rightIconButton={this.rightIconMenu(listValue)}
      />
    );
  }
  addButtonClicked(userInput) {
    this.addTask(userInput);
    this.setState({ addInput: '' });
  }
  addTask(task) {
    let taskId = 0;
    if (this.state.taskList.length > 0) {
      const lastTask = this.state.taskList[this.state.taskList.length - 1];
      taskId = lastTask.id + 1;
    }
    const dt = new Date();
    const utcDate = dt.toUTCString();
    const taskObject =
      {
        text: task,
        time: utcDate,
        state: 'todo',
        id: taskId,
      };
    const newTaskList = this.state.taskList;
    newTaskList.push(taskObject);
    this.setState({ taskList: newTaskList });
  }
  updateAddInput(evt) {
    this.setState({ addInput: evt.target.value });
  }
  renderList(state) {
    const filteredList = this.state.taskList.filter(task => task.state === state);
    return filteredList.map(this.listMapping);
  }
  render() {
    return (
      <Tabs>
        <Tab label="Todo">
          <List>
            {this.renderList('todo')}
          </List>
          <input
            className="input"
            type="text"
            name="add"
            value={this.state.addInput}
            onChange={evt => this.updateAddInput(evt)}
          />
          <button
            type="button"
            onClick={() => this.addButtonClicked(this.state.addInput)}
          >
            add
          </button>
        </Tab>
        <Tab label="In progress">
          <List>
            {this.renderList('in progress')}
          </List>
        </Tab>
        <Tab label="Done">
          <List>
            {this.renderList('done')}
          </List>
        </Tab>
      </Tabs>
    );
  }
}

export default TodoList;
