'use strict';

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('app.html'), 'selected': true});
});
