import React, { Component } from 'react';
import { List, Subheader, Tabs, Tab, Paper, TextField, Divider, MenuItem, SelectField, ListItem } from 'material-ui';
import TodoItem from './todoItem';
import GroupItem from './groupItem';
import LocalStorageAPI from './../../helpers/localstorageAPI';

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
  groupTextField: {
    width: '100%',
    textAlign: 'center',
  },
  newTodoTextField: {
    top: '0px',
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '60%',
  },
  selectGroup: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '40%',
  },
  newTodoHint: {
    width: '98%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};

const status = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};
const ENTER_KEY = 13;

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      editingGroup: null,
      newTodo: '',
      newGroup: '',
      todos: [],
      currentGroup: 0,
      groupList: [],
      storageKey: this.constructor.name,
      currentTab: 'active',
    };

    // .bind(this) can be placed here
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);

    const savedState = LocalStorageAPI.get(this.state.storageKey);
    this.state.currentGroup = 0;
    if (savedState !== null) {
      this.state = savedState;
    }
  }
  componentDidUpdate() {
    LocalStorageAPI.put(this.state.storageKey, this.state);
  }

  onDelete(deletedTodo) {
    const updatedTodos = this.state.todos.filter(todo => todo !== deletedTodo);
    this.setState({ todos: updatedTodos });
  }

  onCancel() {
    this.setState({ editing: null });
  }

  onEdit(editTodo) {
    this.setState({ editing: editTodo.id });
  }

  onSave(editedTodo) {
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

  onCancelGroup() {
    this.setState({ editingGroup: null });
  }

  onEditGroup(editGroup) {
    this.setState({ editingGroup: editGroup.id });
  }

  onSaveGroup(editedGroup) {
    const updatedGroups = [...this.state.groupList].map((group) => {
      if (group.id === editedGroup.id) {
        return editedGroup;
      }
      return group;
    });

    this.setState({ groupList: updatedGroups });
    this.onCancelGroup();
  }
  /* toggledTodo comes from binding, not call back signature */
  onToggle(toggledTodo) {
    const updatedTodos = this.state.todos.map(todo => (todo !== toggledTodo ?
      todo :
      { ...todo, ...{ completed: !todo.completed } }));
    this.setState({ todos: updatedTodos });
  }
  addGroup(value) {
    const newGroup = {
      id: Date.now(),
      name: value,
    };
    this.setState({ groupList: [...this.state.groupList, newGroup] });
  }

  deleteGroup(groupId) {
    const updatedGroups = this.state.groupList.filter(group => group.id !== groupId);
    this.setState({ groupList: updatedGroups });
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

  handleInput(event) {
    if (event.target.id === 'newTodo') {
      this.setState({ newTodo: event.target.value });
    } else if (event.target.id === 'newGroup') {
      this.setState({ newGroup: event.target.value });
    }
  }

  addTodo(value) {
    const todo = {
      id: Date.now(),
      title: value,
      completed: false,
      group: this.state.currentGroup,
    };
    this.setState({ todos: [...this.state.todos, todo] });
  }
  handleGroupChange(event, index, value) {
    this.setState({ currentGroup: value });
  }
  render() {
    const todosByStatus = {};
    Object.values(status).forEach((s) => {
      todosByStatus[s] = [];
    });

    [...this.state.todos].filter(todo => todo.group === this.state.currentGroup).forEach((todo) => {
      const todoComponent = (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={this.state.editing === todo.id}
          onEdit={this.onEdit.bind(this, todo)}
          onCancel={this.onCancel.bind(this)}
          onToggle={this.onToggle.bind(this, todo)}
          onDelete={this.onDelete.bind(this, todo)}
          onSave={this.onSave.bind(this)}
        />
      );
      todosByStatus[status.ALL].push(todoComponent);
      todosByStatus[todo.completed ? status.COMPLETED : status.ACTIVE].push(todoComponent);
    }, this);
    // this was going to be a toggle button
    return (
      <div style={styles.divStyle}>
        <Paper zDepth={0} rounded={false} style={styles.expand}>
          <div>
            <TextField
              id="newTodo"
              style={styles.newTodoTextField}
              value={this.state.newTodo}
              hintText="Todo List - What needs to be done?"
              hintStyle={styles.newTodoHint}
              underlineShow
              onInput={this.handleInput.bind(this)}
              onKeyDown={this.handleNewTodoKeyDown.bind(this)}
            />
            <SelectField
              value={this.state.currentGroup}
              onChange={this.handleGroupChange}
              style={styles.selectGroup}
            >
              <MenuItem value={0} primaryText="default" />
              {this.state.groupList.map(listItem =>
                <MenuItem value={listItem.id} primaryText={listItem.name} />)}
            </SelectField>
          </div>

          <Divider />
          <Tabs
            value={this.state.currentTab}
            onChange={value => this.setState({ currentTab: value })}
          >
            <Tab
              value="active"
              label="active"
            >
              <div>
                <List>
                  {todosByStatus[status.ACTIVE]}
                  <Subheader inset={false}>
                    {todosByStatus[status.ACTIVE].length} items
                  </Subheader>
                </List>
              </div>
            </Tab>
            <Tab
              value="completed"
              label="completed"
            >
              <div>
                <List styles={styles.expand}>
                  {todosByStatus[status.COMPLETED]}
                  <Subheader inset={false}>
                    {todosByStatus[status.COMPLETED].length} items
                  </Subheader>
                </List>
              </div>
            </Tab>
            <Tab
              value="all"
              label="all"
            >
              <div>
                <List>
                  {todosByStatus[status.ALL]}
                  <Subheader inset={false}>
                    {todosByStatus[status.ALL].length} items
                  </Subheader>
                </List>
              </div>
            </Tab>
            <Tab
              value="groups"
              label="groups"
            >
              <List>
                {
                  this.state.groupList.map(group =>
                    (<GroupItem
                      group={group}
                      onDelete={this.deleteGroup.bind(this, group.id)}
                      editing={this.state.editingGroup === group.id}
                      onCancel={this.onCancelGroup.bind(this)}
                      onEdit={this.onEditGroup.bind(this, group)}
                      onSave={this.onSaveGroup.bind(this)}
                    />))
                }
              </List>
              <TextField
                id="newGroup"
                fullWidth
                hintText={<b>add group</b>}
                hintStyle={styles.groupTextField}
                inputStyle={styles.groupTextField}
                underlineShow
                value={this.state.newGroup}
                onInput={this.handleInput.bind(this)}
                onKeyDown={this.handleNewGroupKeyDown.bind(this)}
              />
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default Todo;
