const taskList = document.getElementById("taskList");
const modal = document.getElementById("taskModal");
const addBtn = document.getElementById("addBtn");

addBtn.onclick = () => modal.style.display = "flex";

function closeModal() {
  modal.style.display = "none";
  document.getElementById("taskText").value = "";
  document.getElementById("taskTime").value = "";
}

function saveTask() {
  const text = document.getElementById("taskText").value.trim();
  const time = document.getElementById("taskTime").value;

  if (!text || !time) return alert("Fill both fields");

  const task = { text, time, done: false };
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  closeModal();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function renderTasks() {
  taskList.innerHTML = "";
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleDone(index);

    const text = document.createTextNode(`${task.text} (Due: ${formatTime(task.time)})`);

    label.appendChild(checkbox);
    label.appendChild(text);

    div.appendChild(label);
    taskList.appendChild(div);

    checkForDeadline(task);
  });
}

function toggleDone(index) {
  const tasks = getTasks();
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function formatTime(timeStr) {
  const date = new Date(timeStr);
  return date.toLocaleString("en-IN", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'short'
  });
}

function checkForDeadline(task) {
  const timeLeft = new Date(task.time) - new Date();
  if (timeLeft > 0 && timeLeft < 15 * 60 * 1000 && !task.done) {
    alert(`⏰ Upcoming Task: "${task.text}" is due soon!`);
  }
}

window.onload = renderTasks;
