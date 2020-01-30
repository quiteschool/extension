var NAME_POSITION = 1;
function calculateAmount(values) {

  return values.filter(function(value) { if (parseInt(value)) return true }).length - 1
}

function calculateAmountOverStudents(domElement, students) {
  domElement.querySelectorAll(".table tbody tr").forEach(function(student, index) {
    var value = []

    student.querySelectorAll('.fio, .mark').forEach(function(mark) {
      value = value.concat(mark.textContent.split("\n"))
    })

    var data = students[index + 1]
    var amount = Math.max(0, calculateAmount(value.slice(NAME_POSITION + 1)));

    if (data) {
      data.amount += amount;
    } else {
      students[index + 1] = {
        name: value[NAME_POSITION],
        amount: amount
      };
    }
  });

  return students;
}

function requestAndCollectData(link, students) {
  return new Promise(function(resolve) {
    fetch(link, { credentials: 'include' })
      .then(function(response) { return response.text() })
      .then(function(responseText) {
        var div = document.createElement('div');
        div.innerHTML = responseText;

        if (link.text == '>>') {
          return processPages(div, students)
        } else {
          return calculateAmountOverStudents(div, students);
        }
      }).then(function(students) {
        resolve(students)
      });
  })
}

function collectData() {
  var students = [{ name: "Имя Ученика, Количество Оценок", amount: 0, type: "header" }];
  return processPages(document, students);
}

function processPages(container, students) {
  var promise = new Promise(function(resolve, reject) {
    resolve(calculateAmountOverStudents(container, students));
  });

  container.querySelectorAll(".pages a").forEach(function(link) {
    if (link.text === '<<') return;
    promise = promise.then(function() { return requestAndCollectData(link, students) });
  });

  return promise;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    collectData().then(function(students) { sendResponse(students); });
    return true;
  }
);

chrome.runtime.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
    }
	}, 10);
});
