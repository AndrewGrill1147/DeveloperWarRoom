import React from 'react';
import Todo from '../components/Todo/todo';

const Widgets = {
  'Pull Request': {
    component: <div> Pull Request </div>,
    DefaultSize: { w: 4, h: 2 },
  },
  'Reddit ': {
    component: <div> Reddit </div>,
    DefaultSize: { w: 3, h: 3 },
  },

  'Todo List': {
    component: <Todo />,
    DefaultSize: { w: 2.5, h: 2.5 },
  },
};

export default Widgets;
