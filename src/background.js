/* global chrome */
function IsExtensionTabOpened(url, callback) {
  var result;
  var applicationTab;
  chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.url.includes(url)) {
        result = true;
        applicationTab = tab;
      }
    });
    return callback(result, applicationTab);
  }
  )
}

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  var url = "app.html";
  IsExtensionTabOpened(url, function (result, applicationTab) {
    if (!result) {
      chrome.tabs.create({ url: chrome.extension.getURL(url), selected: true });
    }
    else{
      chrome.tabs.update(applicationTab.id, {active: true});
    }
  });
});

