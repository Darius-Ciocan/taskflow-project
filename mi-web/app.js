(() => {
  const STORAGE_KEY = "taskflow.tasks.v1";

  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const searchInput = document.getElementById("searchInput");

  let tasks = [];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function createTaskNode(task) {
    const li = document.createElement("li");
    li.className = "task-card";
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-row">
        <h3 class="task-title"></h3>
        <span class="task-category">General</span>
        <span class="badge badge--med">Media</span>
        <button class="icon-btn" type="button" aria-label="Eliminar tarea" title="Eliminar">✕</button>
      </div>
      <p class="task-desc"></p>
    `;

    li.querySelector(".task-title").textContent = task.text;
    li.querySelector(".task-desc").textContent = "Guardada en tu navegador (LocalStorage).";

    return li;
  }

  function render(list = tasks) {
    taskList.innerHTML = "";
    list.forEach((t) => taskList.appendChild(createTaskNode(t)));
  }

  function addTask(text) {
    const clean = text.trim();
    if (!clean) return;

    const task = {
      id: String(Date.now()),
      text: clean,
    };

    tasks.unshift(task);
    saveTasks();
    applyFilter();

    taskInput.value = "";
    taskInput.focus();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    applyFilter();
  }

  function applyFilter() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (!q) return render(tasks);
    render(tasks.filter((t) => t.text.toLowerCase().includes(q)));
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(taskInput.value);
  });

  taskList.addEventListener("click", (e) => {
    const btn = e.target.closest(".icon-btn");
    if (!btn) return;

    const li = e.target.closest(".task-card");
    if (!li) return;

    deleteTask(li.dataset.id);
  });

  searchInput?.addEventListener("input", applyFilter);

  document.addEventListener("DOMContentLoaded", () => {
    tasks = loadTasks();
    applyFilter();
  });
})();
