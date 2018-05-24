import React from 'react';
import Todo from '../Todo';
import Github from '../Github';
import Bookmarker from '../Bookmarker';

const Widgets = {
  'Bookmarker': {
    component: <Bookmarker />,
    layout: {
      x: 0,
      y: 0,
      w: 20,
      h: 2,
      minW: 0,
      maxW: Infinity,
      static: true
    }
  },
  'Github': {
    component:  <Github />,
    layout: { w: 4, h: 2 },
  },
  'Todo List': {
    component: <Todo />,
    layout: { w: 2.5, h: 2.5 },
  },
};

//{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4}

export default Widgets;

