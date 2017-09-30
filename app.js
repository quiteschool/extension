var students = [{ name: "Имя Ученика, Количество Оценок", amount: 0, type: "header" }];

var INDEX_POSITION = 1;
var NAME_POSITION = 2;

function calculateAmount(values) {
  return (values.filter(function(value) { if (parseInt(value)) return true }).count - 1
}

document.querySelectorAll(".table tbody tr").forEach(function(student) {
  var value = student.textContent.split("\n");

  student[parseInt(value[INDEX_POSITION])] = {
    name: value[NAME_POSITION].strip(),
    amount: calculateAmount(value.slice(NAME_POSITION + 1))
  };
});
