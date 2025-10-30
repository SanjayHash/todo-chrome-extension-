document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("addBtn").addEventListener("click", addTask);

function loadTasks() {
  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    displayTasks(tasks);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const newTask = input.value.trim();
  if (newTask === "") return;

  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.push(newTask);
    chrome.storage.local.set({ tasks }, () => {
      input.value = "";
      displayTasks(tasks);
    });
  });
}

function deleteTask(index) {
  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.splice(index, 1);
    chrome.storage.local.set({ tasks }, () => {
      displayTasks(tasks);
    });
  });
}

function editTask(index, newValue) {
  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks[index] = newValue;
    chrome.storage.local.set({ tasks }, () => {
      displayTasks(tasks);
    });
  });
}

function displayTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task;
    span.contentEditable = true;
    span.className = "editable";
    span.addEventListener("blur", () => editTask(index, span.textContent.trim()));

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteTask(index);

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}
