const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let todos = [];
let idCounter = 1;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/todos", (req, res) => {
  todos.sort((a, b) => a.completed - b.completed);
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { text } = req.body;
  const todo = { id: idCounter++, text, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const todo = todos.find((t) => t.id == id);
  if (todo) {
    todo.text = text;
    res.json(todo);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.put("/todos/:id/toggle", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id == id);
  if (todo) {
    todo.completed = !todo.completed;
    res.json(todo);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id != id);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
