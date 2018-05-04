/* eslint-env browser */
/* eslint react/jsx-no-bind: 0 */
import React, { Component } from 'react';
import { List, Subheader, Tabs, Tab, Paper, TextField, Divider } from 'material-ui';
import TodoItem from './todoItem';

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
const ENTER_KEY = 13;

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      newTodo: '',
      todos: [],
      storageKey: this.constructor.name,
    };

    // .bind(this) can be placed here
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  // Life cycle methods
  componentDidMount() {
    const savedState = localStorage.getItem(this.state.storageKey);
    if (savedState !== null) {
      this.setState(JSON.parse(savedState));
    }
    window.addEventListener('beforeunload', this.componentWillUnmount);
  }

  componentWillUnmount() {
    localStorage.setItem(this.state.storageKey, JSON.stringify(this.state));
    window.removeEventListener('beforeunload', this.componentDidUpdate);
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

  handleInput(event) {
    this.setState({ newTodo: event.target.value });
  }

  addTodo(value) {
    const todo = {
      id: Date.now(),
      title: value,
      completed: false,
    };
    this.setState({ todos: [...this.state.todos, todo] });
  }

  loadState() {
    localStorage.getItem();
    this.alert('loading state');
  }

  saveState() {
    this.alert('Saving state!');
  }

  render() {
    const todosByStatus = {};
    Object.values(status).forEach((s) => {
      todosByStatus[s] = [];
    });

    [...this.state.todos].forEach((todo) => {
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
          <TextField
            id="newTodo"
            value={this.state.newTodo}
            hintText="Todo List - What needs to be done?"
            underlineShow
            onInput={this.handleInput.bind(this)}
            onKeyDown={this.handleNewTodoKeyDown.bind(this)}
            fullWidth
            multiLine
          />

          <Divider />
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
