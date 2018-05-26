import React, { Component } from 'react';
import { ListItem, Checkbox, TextField, IconButton, IconMenu, MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const styles = {
  iconButtonAlignment: {
    verticalAlign: 'top',
  },
};
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
      editText: this.props.group.name,
    };
  }
  render() {
    const rightIconButtons = (
      <IconMenu
        iconButtonElement={iconButtonElement}
      >
        <MenuItem>Edit</MenuItem>
        <MenuItem onClick={this.props.onDelete}>Delete</MenuItem>
      </IconMenu>
    );
    return (
      <ListItem
        primaryText={this.props.group.name}
        rightIconButton={rightIconButtons}
      />
    );
  }
}

export default GroupItem;
