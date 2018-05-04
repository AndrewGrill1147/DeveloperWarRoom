/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import { ListItem, Checkbox, TextField, IconButton, IconMenu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';

/* This was all a presentational component. If we can pull out the editing to the Main Todo app
   we can return to the presentational style
*/

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const ENTER_KEY = 13;
const ESC_KEY = 27;

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editText: this.props.todo.title,
    };

    this.startEdit = this.startEdit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleEditTodoKeyDown = this.handleEditTodoKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const val = event.target.value.trim();
    if (val) {
      this.props.onSave({ ...this.props.todo, ...{ title: val } });
    } else {
      this.props.onDelete();
    }
  }

  startEdit() {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  }

  handleInput(event) {
    this.setState({ editText: event.target.value });
  }

  handleEditTodoKeyDown(event) {
    if (event.which === ESC_KEY) {
      this.setState({ editText: this.props.title });
      this.props.onCancel();
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  render() {
    const rightIconButtons = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={this.startEdit}>Edit</MenuItem>
        <MenuItem onClick={this.props.onDelete}>Delete</MenuItem>
      </IconMenu>
    );

    if (!this.props.editing) {
      return (
        <ListItem
          primaryText={this.props.todo.title}
          leftCheckbox={
            <Checkbox
              onCheck={this.props.onToggle}
              checked={this.props.todo.completed}
            />
          }
          rightIconButton={rightIconButtons}
        />
      );
    }

    // we are editing this element
    return (
      <ListItem>
        <TextField
          id={this.props.todo.id.toString()}
          value={this.state.editText}
          underlineShow
          onInput={this.handleInput}
          onKeyDown={this.handleEditTodoKeyDown}
          autoFocus
          fullWidth
        />
      </ListItem>
    );
  }
}

export default TodoItem;
