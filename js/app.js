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
  console.log(todos);

  removeAllTodos(todoList);
  countActiveTodos();

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

  displayTodos();
  countActiveTodos();
}

// function checkIfCompleted() {
//   let completedResult = 0;

//   todos.forEach((todo) => (todo.done ? completedResult++ : null));
// }

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
