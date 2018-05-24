import React from 'react';
import Todo from '../Todo';
import Github from '../Github';

const Widgets = {
  'Github': {
    component:  <Github />,
    DefaultSize: { w: 4, h: 2 },
  },
  'Todo List': {
    component: <Todo />,
    DefaultSize: { w: 2.5, h: 2.5 },
  },
};

export default Widgets;

