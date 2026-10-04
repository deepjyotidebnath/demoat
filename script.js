const dateInput = document.getElementById("date");
const form = document.getElementById("add-form");
const nameInput = document.getElementById("name");
const list = document.getElementById("list");
const emptyMsg = document.getElementById("empty");

// students: [{ id, name }]  |  records: { "YYYY-MM-DD": { id: true/false } }
let students = JSON.parse(localStorage.getItem("students")) || [];
let records = JSON.parse(localStorage.getItem("records")) || {};

dateInput.value = new Date().toISOString().slice(0, 10);

function save() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("records", JSON.stringify(records));
}

function dayRecord() {
  const d = dateInput.value;
  if (!records[d]) records[d] = {};
  return records[d];
}

function render() {
  const day = dayRecord();
  list.innerHTML = "";

  students.forEach((s) => {
    const present = day[s.id] === true;
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="name"></span>
      <span class="status ${present ? "present" : "absent"}">${present ? "Present" : "Absent"}</span>
      <button class="toggle">${present ? "Mark absent" : "Mark present"}</button>
      <button class="remove" aria-label="Remove student">&times;</button>`;
    li.querySelector(".name").textContent = s.name; // textContent avoids HTML injection

    li.querySelector(".toggle").onclick = () => {
      day[s.id] = !present;
      save(); render();
    };
    li.querySelector(".remove").onclick = () => {
      students = students.filter((x) => x.id !== s.id);
      save(); render();
    };
    list.appendChild(li);
  });

  const presentCount = students.filter((s) => day[s.id] === true).length;
  document.getElementById("present-count").textContent = presentCount;
  document.getElementById("absent-count").textContent = students.length - presentCount;
  document.getElementById("total-count").textContent = students.length;
  emptyMsg.classList.toggle("hidden", students.length > 0);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  students.push({ id: Date.now().toString(), name });
  nameInput.value = "";
  save(); render();
});

document.getElementById("all-present").onclick = () => {
  const day = dayRecord();
  students.forEach((s) => (day[s.id] = true));
  save(); render();
};

document.getElementById("reset").onclick = () => {
  records[dateInput.value] = {};
  save(); render();
};

dateInput.addEventListener("change", render);
render();
