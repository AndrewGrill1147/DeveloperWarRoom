/* global chrome */
function IsExtensionTabOpened(re, callback) {
  var result;
  var applicationTab;
  chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
    tabs.forEach(function (tab) {
      if (re.test(tab.url)) {
        result = true;
        applicationTab = tab;
        return;
      }
    });
    return callback(result, applicationTab);
  }
  )
}

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  var re = new RegExp("chrome-extension:\/\/*.+\/app.html");
  var url = "app.html";
  IsExtensionTabOpened(re, function (result, applicationTab) {
    if (!result) {
      chrome.tabs.create({ url: chrome.extension.getURL(url), selected: true });
    }
    else{
      chrome.tabs.update(applicationTab.id, {active: true});
    }
  });
});

