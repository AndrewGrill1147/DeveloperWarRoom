import React from 'react';
import Todo from '../Todo';
import Github from '../Github';
import Bookmarker from '../Bookmarker';

// see wiki: 'Adding a custom widget' for requirements
const Widgets = {
  Bookmarker: {
    component: <Bookmarker />,
    layout: {
      x: 0,
      y: 0,
      w: Infinity,
      h: 2,
      minW: 0,
      static: true,
    },
  },
  Github: {
    component: <Github />,
    layout: {
      w: 12,
      h: 15,
      minW: 8,
      minH: 11,
    },
  },
  'Todo List': {
    component: <Todo />,
    layout: {
      w: 8,
      h: 10,
      minW: 6,
      minH: 10,
    },
  },
};

export default Widgets;

