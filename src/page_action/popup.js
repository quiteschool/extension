function loadContent(mainPopup) {
  mainPopup.classList.remove("loaded");

  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    var activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, { message: "loadContent" }, function(response) {
      mainPopup.classList.add("loaded");

      var loadedContent = document.querySelector("#loaded-content");
      var content = ""

      for(var i = 1; i < response.length; i++) {
        content += `
          <div>
            <span>${response[i].name}:\t</span>
            <span>${response[i].amount}</span>
          </div>
        `
      }

      loadedContent.innerHTML = content;
    });
  })
}

document.addEventListener('DOMContentLoaded', function() {
  var mainPopup = document.querySelector('#mainPopup');
  var reloadButton = document.querySelector('#reload');

  reloadButton.onclick = function() { loadContent(mainPopup); }
  loadContent(mainPopup);
});
