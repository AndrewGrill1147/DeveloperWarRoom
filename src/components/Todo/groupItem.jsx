import React, { Component } from 'react';
import { ListItem, TextField, IconButton, IconMenu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color="gray" />
  </IconButton>
);

const ENTER_KEY = 13;
const ESC_KEY = 27;

class GroupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editText: this.props.group.title,
    };

    this.startEdit = this.startEdit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleEditGroupKeyDown = this.handleEditGroupKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const val = event.target.value.trim();
    if (val) {
      this.props.onGroupSave({ ...this.props.group, ...{ title: val } });
    } else {
      this.props.onGroupDelete();
    }
  }

  startEdit() {
    this.props.onGroupEdit();
    this.setState({ editText: this.props.group.title });
  }

  handleInput(event) {
    this.setState({ editText: event.target.value });
  }

  handleEditGroupKeyDown(event) {
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
        <MenuItem onClick={this.props.onGroupDelete}>Delete</MenuItem>
      </IconMenu>
    );

    if (!this.props.editing) {
      return (
        <ListItem
          primaryText={this.props.group.title}
          rightIconButton={rightIconButtons}
        />
      );
    }

    // we are editing this element
    return (
      <ListItem>
        <TextField
          id={this.props.group.id.toString()}
          value={this.state.editText}
          underlineShow
          onInput={this.handleInput}
          onKeyDown={this.handleEditGroupKeyDown}
          autoFocus
          fullWidth
        />
      </ListItem>
    );
  }
}

export default GroupItem;
