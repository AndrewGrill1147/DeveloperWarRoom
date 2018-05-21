import React, { Component } from 'react';
import { List, Subheader, Tabs, Tab, Paper, TextField, Divider, ListItem, makeSelectable, IconButton, IconMenu, MenuItem } from 'material-ui';
import TodoItem from './todoItem';
import GroupItem from './groupItem';
import LocalStorageAPI from './../../helpers/localstorageAPI';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
  tabHeadline: {
    fontSize: 12,
    paddingTop: 2,
    marginBottom: 2,
    fontWeight: 200,
  },
  listStyle: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  divStyle: {
    display: 'flex',
    flexDirection: 'column',
    background: '#75a3a3',
    width: '100%',
    height: '100%',
  },
  expand: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    overflow: 'auto',
  },
};

const status = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

const tempGroups = [
  {
    id: 'a',
    title: "Group A",
  },
  {
    id: 'b',
    title: "Group B",
  },
];

const ENTER_KEY = 13;

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      newTodo: '',
      newGroup: '',
      todos: [],
      groups: [],
      currentGroup: 'Group A',
      storageKey: this.constructor.name,
    };

    // .bind(this) can be placed here
    this.componentDidUpdate = this.componentDidUpdate.bind(this);

    const savedState = LocalStorageAPI.get(this.state.storageKey);
    if (savedState !== null) {
      this.state = savedState;
    }

    this.state.groups=tempGroups;
  }

  componentDidUpdate() {
    LocalStorageAPI.put(this.state.storageKey, this.state);
  }

  onTodoDelete(deletedTodo) {
    const updatedTodos = this.state.todos.filter(todo => todo !== deletedTodo);
    this.setState({ todos: updatedTodos });
  }

  onGroupDelete(deletedGroup) {
    const updatedGroups = this.state.groups.filter(group => group !== deletedGroup);
    this.setState({ groups: updatedGroups });
  }

  onCancel() {
    this.setState({ editing: null });
  }

  onTodoEdit(editTodo) {
    this.setState({ editing: editTodo.id });
  }

  onGroupEdit(editGroup) {
    this.setState({ editing: editGroup.id });
  }

  onTodoSave(editedTodo) {
    // update the todos
    const updatedTodos = [...this.state.todos].map((todo) => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      }
      return todo;
    });

    this.setState({ todos: updatedTodos });
    this.onCancel();
  }

  onGroupSave(editedGroup) {
    // update the todos
    const updatedGroups = [...this.state.groups].map((group) => {
      if (group.id === editedGroup.id) {
        return editedGroup;
      }
      return group;
    });

    this.setState({ groups: updatedGroups });
    this.onCancel();
  }

  /* toggledTodo comes from binding, not call back signature */
  onToggle(toggledTodo) {
    const updatedTodos = this.state.todos.map(todo => (todo !== toggledTodo ?
      todo :
      { ...todo, ...{ completed: !todo.completed } }));
    this.setState({ todos: updatedTodos });
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = this.state.newTodo.trim();

    if (val) {
      this.addTodo(val);
      this.setState({ newTodo: '' });
    }
  }

  handleNewGroupKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = this.state.newGroup.trim();

    if (val) {
      this.addGroup(val);
      this.setState({ newGroup: '' });
    }
  }

  handleTodoInput(event) {
    this.setState({ newTodo: event.target.value });
  }

  handleGroupInput(event) {
    this.setState({ newGroup: event.target.value });
  }

  addTodo(value) {
    const todo = {
      id: Date.now(),
      title: value,
      completed: false,
    };
    this.setState({ todos: [...this.state.todos, todo] });
  }

  addGroup(value) {
    const group = {
      id: Date.now(),
      title: value,
    };
    this.setState({ groups: [...this.state.groups, group] });
  }

  setGroup(value) {
    this.setState({ currentGroup: value });
  }

  render() {
    const myGroups = [];
    const todosByStatus = {};
    todosByStatus[status.ACTIVE] = [];
    todosByStatus[status.COMPLETED] = [];
    todosByStatus[status.ALL] = [];

    [...this.state.groups].forEach((group) => {
      const groupComponent = (
        <GroupItem
          key={group.id}
          group={group}
          primaryText={group.title}
          onGroupEdit={this.onGroupEdit.bind(this,group)}
          onCancel={this.onCancel.bind(this)}
          onGroupDelete={this.onGroupDelete.bind(this, group)}
          onGroupSave={this.onGroupSave.bind(this)}
          //setGroup={this.setGroup.bind(this, group)}
          //onClick={this.setGroup}
        />
      );
      myGroups.push(groupComponent);
    }, this);

    myGroups.push(
      <ListItem key="addGroup">
        <TextField
          id="newGroup"
          value={this.state.newGroup}
          hintText="Add a new Group"
          underlineShow
          onInput={this.handleGroupInput.bind(this)}
          onKeyDown={this.handleNewGroupKeyDown.bind(this)}
          //fullWidth
          multiLine
        />
        <IconButton
          style={styles.iconButtonAlignment}
          onClick={() => this.addGroup(this.state.newGroup)}
        >
          <ContentAdd color="gray" />
        </IconButton>
      </ListItem>
    );

    [...this.state.todos].forEach((todo) => {
      const todoComponent = (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={this.state.editing === todo.id}
          onTodoEdit={this.onTodoEdit.bind(this, todo)}
          onCancel={this.onCancel.bind(this)}
          onToggle={this.onToggle.bind(this, todo)}
          onTodoDelete={this.onTodoDelete.bind(this, todo)}
          onTodoSave={this.onTodoSave.bind(this)}
        />
      );
      todosByStatus[status.ALL].push(todoComponent);
      todosByStatus[todo.completed ? status.COMPLETED : status.ACTIVE].push(todoComponent);
    }, this);

    // this was going to be a toggle button
    return (
      <div style={styles.divStyle}>
        <Paper zDepth={0} rounded={false} style={styles.expand}>
          <TextField
            id="newTodo"
            value={this.state.newTodo}
            hintText="Todo List - What needs to be done?"
            underlineShow
            onInput={this.handleTodoInput.bind(this)}
            onKeyDown={this.handleNewTodoKeyDown.bind(this)}
            fullWidth
            multiLine
          />

          <List>
            <ListItem primaryText={this.props.currentGroup} nestedItems={myGroups} />
          </List>
          <Tabs>
            <Tab label="active">
              <div>
                <List>
                  {todosByStatus[status.ACTIVE]}
                  <Subheader inset={false}>
                    {todosByStatus[status.ACTIVE].length} items
                  </Subheader>
                </List>
              </div>
            </Tab>
            <Tab label="completed">
              <div>
                <List styles={styles.expand}>
                  {todosByStatus[status.COMPLETED]}
                  <Subheader inset={false}>
                    {todosByStatus[status.COMPLETED].length} items
                  </Subheader>
                </List>
              </div>
            </Tab>
            <Tab label="all">
              <div>
                {todosByStatus[status.ALL]}
                <Subheader inset={false}>
                  {todosByStatus[status.ALL].length} items
                </Subheader>
              </div>
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default Todo;
