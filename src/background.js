/* global chrome */
function IsExtensionTabOpened(url, callback) {
  var result;
  chrome.tabs.query({ 'active': true, 'currentWindow': true }, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.url.includes(url)) {
        result = true;
      }
    });
    return callback(result);
  }
  )
}

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  var url = "app.html";
  IsExtensionTabOpened(url, function (result) {
    if (!result) {
      chrome.tabs.create({ url: chrome.extension.getURL(url), selected: true });
    }
  });
});

