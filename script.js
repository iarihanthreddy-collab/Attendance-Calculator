var subjects = ["icp", "maths", "webdev"];
var target = 75; // 75% is mandatory for every subject
var button = document.getElementById("calc-btn");

// load saved values when the page opens
function loadData() {
  var saved = localStorage.getItem("attendanceData");
  if (saved) {
    var data = JSON.parse(saved);
    for (var i = 0; i < subjects.length; i++) {
      var name = subjects[i];
      document.getElementById(name + "-total").value = data[name].total;
      document.getElementById(name + "-attended").value = data[name].attended;
    }
    calculateAll();
  }
}

// save values
function saveData() {
  var data = {};
  for (var i = 0; i < subjects.length; i++) {
    var name = subjects[i];
    data[name] = {
      total: document.getElementById(name + "-total").value,
      attended: document.getElementById(name + "-attended").value
    };
  }
  localStorage.setItem("attendanceData", JSON.stringify(data));
}

// calculate for one subject
function calculate(name) {
  var total = Number(document.getElementById(name + "-total").value);
  var attended = Number(document.getElementById(name + "-attended").value);
  var resultBox = document.getElementById(name + "-result");

  // check the inputs
  if (total <= 0 || attended < 0) {
    resultBox.className = "result error";
    resultBox.innerHTML = "Please enter valid numbers.";
    return;
  }
  if (attended > total) {
    resultBox.className = "result error";
    resultBox.innerHTML = "Attended cannot be more than total.";
    return;
  }

  var current = (attended / total) * 100;
  var t = target / 100;
  var text = "Attendance: " + current.toFixed(1) + "%<br>";

  if (current >= target) {
    // how many classes can I miss and still stay at 75%
    var canSkip = Math.floor(attended / t - total);
    resultBox.className = "result safe";
    text = text + "You can skip <b>" + canSkip + "</b> more classes.";
  } else {
    // how many classes in a row I must attend
    var need = Math.ceil((t * total - attended) / (1 - t));
    resultBox.className = "result danger";
    text = text + "Attend <b>" + need + "</b> classes in a row to recover.";
  }

  resultBox.innerHTML = text;
}

function calculateAll() {
  for (var i = 0; i < subjects.length; i++) {
    calculate(subjects[i]);
  }
  saveData();
}

button.addEventListener("click", calculateAll);
loadData();
