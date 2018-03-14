import React from 'react';
import { List, ListItem } from 'material-ui/List';

/*
 *TODO: add onClick to each ListItem to acually open up a widget component
 */

function MenuList() {
  return (
    <List>
      <ListItem primaryText="Github" />
      <ListItem primaryText="Reddit" />
      <ListItem primaryText="Todo List" />
      <ListItem primaryText="Slack" />
    </List>
  );
}

export default MenuList;
