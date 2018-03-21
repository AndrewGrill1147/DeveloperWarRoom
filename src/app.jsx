import React from 'react';
import { render } from 'react-dom';
import Home from './components/home';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import './index.css';


const store = new Store({
  portName: 'dwr',
  state: {default: 'default state'}
})

render(
  <Provider store={store}>
    <Home />
  </Provider>
  , document.getElementById('root'),
);
