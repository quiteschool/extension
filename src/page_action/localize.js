function replace_i18n(obj, tag) {
    var msg = tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : '';
    });

    if(msg != tag) obj.innerHTML = msg;
}

function localizeHtmlPage() {
  // Localize using __MSG_***__ data tags
  var data = document.querySelectorAll('[data-localize]');

  for (var i in data) if (data.hasOwnProperty(i)) {
    var obj = data[i];
    var tag = obj.getAttribute('data-localize').toString();

    replace_i18n(obj, tag);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  localizeHtmlPage();
});
