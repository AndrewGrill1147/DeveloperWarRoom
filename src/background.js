/* global chrome */
function IsExtensionTabOpened(url, callback) {
  var result;
  var selectedTab;
  chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.url.includes(url)) {
        result = true;
        selectedTab = tab;
      }
    });
    return callback(result, selectedTab);
  }
  )
}

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  var url = "app.html";
  IsExtensionTabOpened(url, function (result, selectedTab) {
    if (!result) {
      chrome.tabs.create({ url: chrome.extension.getURL(url), selected: true });
    }
    else{
      chrome.tabs.update(selectedTab.id, {active: true});
    }
  });
});

