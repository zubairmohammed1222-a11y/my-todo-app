const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const themeToggle = document.querySelector("#theme-toggle");
const sunIcon = document.querySelector(".sun-icon");
const moonIcon = document.querySelector(".moon-icon");
const storageKey = "little-list-tasks";
const themeKey = "little-list-theme";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(storageKey);
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    return Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean",
        )
      : [];
  } catch (error) {
    console.error("Could not load saved tasks.", error);
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks.", error);
  }
}

function renderTasks() {
  taskList.replaceChildren();

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = "task-item";
    if (task.completed) item.classList.add("is-complete");

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as complete`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-task";
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Remove "${task.text}"`);
    removeButton.addEventListener("click", () => {
      tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, removeButton);
    taskList.append(item);
  }

  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  emptyMessage.hidden = tasks.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });
  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
});

// Theme toggle functionality
function initializeTheme() {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }
}

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  // Toggle icons
  if (document.body.classList.contains("dark-theme")) {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }

  // Save theme preference
  const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
  localStorage.setItem(themeKey, theme);
});

// Initialize theme on page load
initializeTheme();

renderTasks();