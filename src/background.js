/* global chrome */
function IsExtensionTabOpened(re, callback) {
  let result;
  let applicationTab;
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (re.test(tab.url)) {
        result = true;
        applicationTab = tab;
      }
    });
    return callback(result, applicationTab);
  });
}

/* Opens app when browser icon (action) is clicked */
chrome.browserAction.onClicked.addListener(() => {
  // causes lint errors unnecessary escape charaters: \/ no-useless-escape
  // const re = new RegExp('chrome-extension:\/\/*.+\/app.html');
  const re = new RegExp('chrome-extension://*.+/app.html');
  const url = 'app.html';
  IsExtensionTabOpened(re, (result, applicationTab) => {
    if (!result) {
      chrome.tabs.create({ url: chrome.extension.getURL(url), selected: true });
    } else {
      chrome.tabs.update(applicationTab.id, { active: true });
    }
  });
});