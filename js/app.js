import Modal from "./modal.js";

const check = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>`;
const error = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path fill-rule="evenodd" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>`;
const info = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>`;

const todoForm = document.querySelector(".todo__form");
const todoInput = document.querySelector(".todo__form-input");
const todoList = document.querySelector(".todo__list");
const toodsCounter = document.querySelector(".todo__menu-counter");
const clearCompleted = document.querySelector("[data-clear]");
const tabs = document.querySelectorAll("[data-tabs]");
var modal = new Modal();

let todos = JSON.parse(localStorage.getItem("savedTodo")) || [];

// function to desplay todo depending on uers choice
function displayTodos(tab = "all") {
  todos = JSON.parse(localStorage.getItem("savedTodo")) || [];

  removeAllTodos(todoList);
  countActiveTodos();

  todos.length == 0 ? renderWhileEmpty(tab) : checkIfCompletedTodo(tab);

  todos.forEach((todo, index) => {
    if (tab == "all") {
      renderList(todo, index);
    } else if (tab == "active" && !todo.done) {
      renderList(todo, index);
    } else if (tab == "completed" && todo.done) {
      renderList(todo, index);
    }
  });
}

// function to render todo
function renderList(list, index) {
  let htmlCode = `<li id=${list.id} class="todo__item ${
    list.done ? "completed" : ""
  }" data-index="${index}">
        <input id="item${index}" class="todo__item-input" ${
    list.done ? "checked" : ""
  } type="checkbox" />
        <label class="todo__label" for="item${index}">
            <span class="todo__label-text">${list.text}</span>
            <span class="todo__span"></span>
        </label>
        <button class="todo__deleteBtn" data-delIndex="${index}">
            <svg class="todo__deleteBtn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/>
            </svg>
        </button>
    </li>
    `;
  todoList.innerHTML += htmlCode;
}

// function to add todo into lists
function addTodo(event) {
  event.preventDefault();
  if (!formValidation(todoInput.value)) return;

  let todo = {
    text: todoInput.value,
    done: false,
    id: todos.length,
  };

  todos = JSON.parse(localStorage.getItem("savedTodo")) || [];
  todos.push(todo);

  localStorage.setItem("savedTodo", JSON.stringify(todos));
  todoForm.reset();

  showActiveTab(tabs[0]);
  displayTodos();
  countActiveTodos();
}

// function to remove specific todo
function removeTodo(e) {
  if (!e.target.matches("button")) return;
  e.preventDefault();
  modal.show("Success! Todo has been removed.", "success", check);

  let idx = e.target.dataset.delindex;
  todos.splice(idx, 1);

  localStorage.setItem("savedTodo", JSON.stringify(todos));
  displayTodos();
  countActiveTodos();
}

// function to verify form
function formValidation(value) {
  if (!value.trim()) {
    modal.show("Error! Todo cannot be blank", "error", error);
    todoForm.reset();
    return false;
  } else if (value.length >= 35) {
    modal.show("Error! Maximum 35 character", "error", error);
    todoForm.reset();
    return false;
  } else {
    modal.show("success! Todo has been added", "success", check);
    return true;
  }
}

// function to dynamically count how many active task is left
function countActiveTodos() {
  let count = 0;
  todos.forEach((todo) => (todo.done ? null : count++));

  toodsCounter.innerHTML = `${count} ${
    count <= 1 ? "item left" : "items left"
  }`;

  document.title = `Todo app 
  ${count > 0 ? `| (${count})` : ""}`;
}

// function to done/undone on click
function toggleDone(e) {
  if (e.target.matches("button")) return;
  if (todos.length == 0) return;

  e.preventDefault();

  const idx = e.target.closest("li").dataset.index;
  const item = e.target.closest("li");
  const checkbox = item.querySelector(".todo__item-input");

  todos[idx].done = !todos[idx].done;
  todos[idx].done
    ? item.classList.add("completed")
    : item.classList.remove("completed");
  todos[idx].done ? (checkbox.checked = true) : (checkbox.checked = false);

  localStorage.setItem("savedTodo", JSON.stringify(todos));
  countActiveTodos();
}

// function to remove completed todo
function removeCompletedTodos() {
  todos = JSON.parse(localStorage.getItem("savedTodo"));

  const filteredTodos = todos.filter((todo) => !todo.done);

  localStorage.setItem("savedTodo", JSON.stringify(filteredTodos));

  showActiveTab(tabs[0]);
  displayTodos();
  countActiveTodos();
}

// function to remove child of given list
function removeAllTodos(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

// function to add active class to selected tab
function showActiveTab(isActive = false) {
  tabs.forEach((tab) => tab.classList.remove("active"));
  isActive ? isActive.classList.add("active") : null;
}

// function to render if todo is empty
function renderWhileEmpty(tab) {
  const listItem = document.createElement("li");
  listItem.classList.add("todo__item", "todo__item-info");

  listItem.innerHTML = `<svg class="todo__item-info-icon" xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg> ${
    tab == "completed"
      ? "You have no completed todo todo display!"
      : "You have no active todo todo display!"
  }`;

  todoList.appendChild(listItem);
}

// function to check if completed or not todo
function checkIfCompletedTodo(tab) {
  let activeCount = 0;
  let completedCount = 0;

  todos.forEach((todo) => (todo.done ? completedCount++ : activeCount++));

  if (completedCount == 0 && tab == "completed") {
    renderWhileEmpty(tab);
  } else if (activeCount == 0 && tab == "active") {
    renderWhileEmpty(tab);
  }
}

// Sortable
let sortable = Sortable.create(todoList, {
  animation: 150,

  onSort: () => {
    let listItems = todoList.childNodes;
    let oldTodos = JSON.parse(localStorage.getItem("savedTodo"));
    let sortedTodos = [];
    let todosId = [];

    listItems.forEach((todo) => todosId.push(todo.id));

    todosId.forEach((id) => {
      oldTodos.forEach((item, index) => {
        if (id == item.id) {
          sortedTodos.push(item);
          oldTodos.splice(index, 1);
        }
      });
    });
    localStorage.setItem("savedTodo", JSON.stringify(sortedTodos));
  },
});

// Event listenres
displayTodos();
countActiveTodos();
todoForm.addEventListener("submit", (event) => addTodo(event));

document.querySelector(".todo__list").addEventListener("click", (event) => {
  toggleDone(event);
  removeTodo(event);
});

clearCompleted.addEventListener("click", removeCompletedTodos);

tabs.forEach((tab) =>
  tab.addEventListener("click", (event) => {
    let activeTab = event.target.dataset.tabs;
    showActiveTab(tab);
    displayTodos(activeTab);
  })
);

// Class for creating a modal
