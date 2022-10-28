const todoForm = document.querySelector(".todo__form");
const todoInput = document.querySelector(".todo__form-input");
const todoList = document.querySelector(".todo__list");
const toodsCounter = document.querySelector(".todo__menu-counter");
const clearCompleted = document.querySelector("[data-clear]");
const tabs = document.querySelectorAll("[data-tabs]");

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

// function to render todo
function renderList(list, index) {
  let htmlCode = `<li class="todo__item ${
    list.done ? "completed" : ""
  }" data-index="${index}">
        <input id="item${index}" class="todo__item-input" ${
    list.done ? "checked" : ""
  } type="checkbox" />
        <label class="todo__label" for="item${index}">
            <span class="todo__label-text">${list.text}</span>
            <span class="todo__span"></span>
        </label>
        <button class="todo__deleteBtn" onclick="removeTodo(${index})">
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
function removeTodo(index) {
  // e.stopPropagation()
  todos = JSON.parse(localStorage.getItem("savedTodo"));
  todos.splice(index, 1);
  localStorage.setItem("savedTodo", JSON.stringify(todos));
  displayTodos();
  countActiveTodos();
  console.log("Sucess! Todo has been added");
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

// Event listenres
displayTodos();
countActiveTodos();
todoForm.addEventListener("submit", (event) => addTodo(event));

document
  .querySelector(".todo__list")
  .addEventListener("click", (event) => toggleDone(event));

clearCompleted.addEventListener("click", removeCompletedTodos);

tabs.forEach((tab) =>
  tab.addEventListener("click", (event) => {
    let activeTab = event.target.dataset.tabs;
    showActiveTab(tab);
    displayTodos(activeTab);
  })
);
