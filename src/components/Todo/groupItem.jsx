import React, { Component } from 'react';
import { ListItem, TextField, IconButton, IconMenu, MenuItem, Dialog, FlatButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const ENTER_KEY = 13;
const ESC_KEY = 27;
const iconButtonElement = (
  <IconButton
    touch
  >
    <MoreVertIcon color="gray" />
  </IconButton>
);

class GroupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      editText: this.props.group.name,
    };
    // edit functionality copied from todoItem
    this.startEdit = this.startEdit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleEditGroupKeyDown = this.handleEditGroupKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleSubmit(event) {
    const val = event.target.value.trim();
    if (val) {
      this.props.onSave({ ...this.props.group, ...{ name: val } });
    } else {
      this.props.onDelete();
    }
  }

  startEdit() {
    this.props.onEdit();
    this.setState({ editText: this.props.group.name });
  }

  handleInput(event) {
    this.setState({ editText: event.target.value });
  }

  handleEditGroupKeyDown(event) {
    if (event.which === ESC_KEY) {
      this.setState({ editText: this.props.group.name });
      this.props.onCancel();
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleConfirm() {
    this.props.onDelete();
    this.handleClose();
  }

  render() {
    const deleteActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Confirm"
        primary
        onClick={this.handleConfirm}
      />,
    ];

    const rightIconButtons = (
      <IconMenu
        iconButtonElement={iconButtonElement}
      >
        <MenuItem onClick={this.startEdit}>Edit</MenuItem>
        <MenuItem onClick={this.handleOpen}>Delete</MenuItem>
      </IconMenu>
    );

    if (!this.props.editing) {
      return (
        <div>
          <ListItem
            primaryText={this.props.group.name}
            rightIconButton={this.props.group.id !== 0 ? rightIconButtons : null}
            disabled
          />
          <Dialog
            actions={deleteActions}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            Are you sure you want to delete this group? You will lose all its Todo items.
          </Dialog>
        </div>
      );
    }

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
