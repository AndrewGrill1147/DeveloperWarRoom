/* global chrome */
import { wrapStore } from 'react-chrome-redux';
import configureStore from './config/configureStore';

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.extension.getURL('app.html'), selected: true });
});

const store = configureStore();

wrapStore(store, { portName: 'dwr' });