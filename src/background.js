/* global chrome */

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.extension.getURL('app.html'), selected: true });
});
