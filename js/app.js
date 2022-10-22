// import { sampleTodo } from "./sampleTodo";

const todoForm = document.querySelector(".todo__form");
const todoInput = document.querySelector(".todo__form-input");
const todoList = document.querySelector(".todo__list");

let todos = [];

todoForm.addEventListener("submit", addTodo);

function addTodo(event) {
  event.preventDefault();
  if (!formValidation(todoInput.value)) return;

  if (todos == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("savedTodo"));
  }

  todos.push(todoInput.value);
  todoForm.reset();
  localStorage.setItem("savedTodo", JSON.stringify(todos));
  renderList();
}

// function to display todo list
function renderList() {
  if (localStorage.getItem("savedTodo") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("savedTodo"));
  }

  let htmlCode = "";

  todos.forEach((list, index) => {
    htmlCode += `
    <li class="todo__item">
        <input class="todo__item-input" type="checkbox" />
        <label class="todo__label" for="item${index}">
            <span class="todo__label-text">${list}</span>
            <span class="todo__span"></span>
        </label>
        <button class="todo__deleteBtn" onclick="removeTodo(${index})">
            <svg class="todo__deleteBtn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
            </svg>
        </button>
    </li>
    `;
  });

  todoList.innerHTML = htmlCode;
}

// function to remove specific todo
function removeTodo(index) {
  todos = JSON.parse(localStorage.getItem("savedTodo"));
  todos.splice(index, 1);
  localStorage.setItem("savedTodo", JSON.stringify(todos));
  renderList();
}

// function to verify form
function formValidation(value) {
  if (!value.trim()) {
    todoForm.reset();
    console.log("Error! Todo cannot be blank");
    return false;
  } else if (value.length >= 35) {
    todoForm.reset();
    console.log("Error! Maximum 35 character");
    return false;
  } else {
    console.log("success! Todo has been added");
    return true;
  }
}

renderList();
