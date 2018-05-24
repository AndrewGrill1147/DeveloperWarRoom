import React from 'react';
import { IconButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const RemoveIcon = props => (
  <IconButton iconStyle={{ width: 20, height: 20 }}>
    <ActionDelete {...props} />
  </IconButton>
);

export default RemoveIcon;
