const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

addBtn.addEventListener("click", addTodo);

function fetchTodos() {
  fetch("/todos")
    .then((response) => response.json())
    .then(renderTodos);
}

function renderTodos(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="edit" onclick="editTodo(${todo.id})">Edit</button>
        <button class="delete" onclick="deleteTodo(${todo.id})">Delete</button>
        <button onclick="toggleComplete(${todo.id})">
          ${todo.completed ? "Incomplete" : "Complete"}
        </button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    fetch("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then(() => {
      fetchTodos();
      todoInput.value = "";
    });
  }
}

function deleteTodo(id) {
  fetch(`/todos/${id}`, { method: "DELETE" }).then(fetchTodos);
}

function toggleComplete(id) {
  fetch(`/todos/${id}/toggle`, { method: "PUT" }).then(fetchTodos);
}

function editTodo(id) {
  const newText = prompt("Edit your todo:");
  if (newText) {
    fetch(`/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    }).then(fetchTodos);
  }
}

fetchTodos();
