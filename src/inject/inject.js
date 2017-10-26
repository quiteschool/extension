var NAME_POSITION = 0;

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

    if (data) {
      data.amount += calculateAmount(value.slice(NAME_POSITION + 1));
    } else {
      students[index + 1] = {
        name: value[NAME_POSITION],
        amount: calculateAmount(value.slice(NAME_POSITION + 1))
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

        resolve(calculateAmountOverStudents(div, students));
      });
  })
}

function collectData() {
  var students = [{ name: "Имя Ученика, Количество Оценок", amount: 0, type: "header" }];
  var promise = new Promise(function(resolve, reject) {
    resolve(calculateAmountOverStudents(document, students));
  });

  document.querySelectorAll(".pages a").forEach(function(link) {
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
