//example of using a message handler from the inject scripts
chrome.action.disable();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.action.enable(sender.tab.id);
    sendResponse();
  });
