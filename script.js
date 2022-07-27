import { getTodos, postTodo, deleteTodo } from "./requests.js";
import { displayElement, displayTotal, clearInput } from "./utilities.js";

const listContainer = document.querySelector(".todo__lists");
const submitBtn = document.querySelector(".btn__submit");
const changeBtn = document.querySelector(".btn__change");
const submitTodoHeading = document.querySelector(".heading");
const totalTodo = document.querySelector(".total__value");

const sortEl = document.querySelector(".sort");
const posAbsoluteContainer = document.querySelector(".absolute");
const titleEl = document.querySelector(".title");
const statusEl = document.querySelector(".status");

let todos = [];

const init = async () => {
  try {
    const data = await getTodos();
    todos = [...data];
    renderData(todos);
    displayTotal(totalTodo, todos.length);
  } catch (err) {
    console.log(err);
  }
};
init();

const updateInput = function (todo) {
  titleEl.value = todo.title;
  statusEl.value = todo.completed;
  titleEl.focus();
};

// Display data
const renderData = function (todos, sort = false) {
  listContainer.innerHTML = "";

  const objs = sort ? todos.slice().reverse() : todos;

  objs.forEach((obj, i) => {
    const html = `
      <li class="todo__list">
        <div>
          <p class="todo__object">title: ${obj?.title}</p>
          <p class="todo__object">completed: ${obj?.completed}</p>
        </div>
        <div class="btns">
          <button class="btn btn__edit" data-id='${obj.id}'>Edit</button>
          <button class="btn btn__delete" data-id='${obj.id}'>Delete</button>
          <button class="btn btn__cancel hidden" data-id='${obj.id}'>Cancel</button>

        </div>
      </li>`;

    listContainer.insertAdjacentHTML("beforeend", html);
  });
};

// ============HANDLERS=========

const deleteHandler = (id, parentEl) => {
  try {
    deleteTodo(id);
    parentEl.remove();
    displayElement(posAbsoluteContainer, "Successfully deleted");

    todos = todos.filter((todo) => {
      return todo.id !== +id;
    });

    displayTotal(totalTodo, todos.length);
  } catch (err) {
    displayElement(posAbsoluteContainer, err.message);
  }
};

const postTodoHandler = async (todo) => {
  try {
    const data = await postTodo(todo);
    todos = [...todos, data];
    displayElement(posAbsoluteContainer, "Successfully posted");

    const html = `
  <li class="todo__list">
  <div>
    <p class="todo__object">title: ${data.title}</p>
    <p class="todo__object">completed: ${data.completed}</p>
  </div>
  <div class="btns">
    <button class="btn btn__edit" data-id='${data.id}'>Edit</button>
    <button class="btn btn__delete" data-id='${data.id}'>Delete</button>
    <button class="btn btn__cancel hidden" data-id='${data.id}'>Cancel</button>
  </div>
</li>`;

    listContainer.insertAdjacentHTML(
      !reversed ? "beforeend" : "afterbegin",
      html
    );

    clearInput(titleEl, statusEl);
    displayTotal(totalTodo, todos.length);
  } catch (err) {
    console.log(err);
  }
};

const editHandler = function (id, parent, allParents, allEditBtns) {
  const cancelBtn = parent.querySelector(".btn__cancel");
  const deleteBtn = parent.querySelector(".btn__delete");

  submitTodoHeading.innerText = "edit todo";

  // find todo
  currentTodo = todos.find((todo) => todo.id === +id);
  currentTodoIndex = todos.findIndex((todo) => todo.id === +id);
  updateInput(currentTodo);

  allParents.forEach((parent) => parent.classList.remove("active"));
  allEditBtns.forEach((btn) => {
    if (btn.dataset.id === id) {
      btn.classList.add("hidden");
    } else {
      btn.classList.add("disabled");
      btn.setAttribute("disabled", true);
    }
  });

  parent.classList.toggle("active");
  submitBtn.classList.add("hidden");
  changeBtn.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");
  deleteBtn.classList.add("hidden");
};

const cancelHandler = function (id, parent, allEditBtns) {
  const deleteBtn = parent.querySelector(".btn__delete");

  submitTodoHeading.innerText = "Submit todo";

  allEditBtns.forEach((btn) => {
    if (btn.dataset.id === id) {
      btn.classList.remove("hidden");
    } else {
      console.log(1);
      btn.classList.remove("disabled");
      btn.removeAttribute("disabled");
    }
  });

  parent.classList.remove("active");
  this.classList.add("hidden");
  deleteBtn.classList.remove("hidden");

  submitBtn.classList.remove("hidden");
  changeBtn.classList.add("hidden");

  clearInput(statusEl, titleEl);
};

// ============EVENTS Listener=========

const isEmpty = (...values) => {
  return values.some((value) => value === "");
};

const isBoolean = (value) => {
  return value === "true" || value === "false";
};
// Submit form
submitBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  let title = titleEl.value;
  let completed = statusEl.value;

  if (isEmpty(title, completed)) {
    displayElement(posAbsoluteContainer, "Please complete fields");
    return;
  }
  if (!isBoolean(completed)) {
    statusEl.focus();
    displayElement(posAbsoluteContainer, "Please enter true or false");
    return;
  }

  const todo = {
    completed: Boolean(completed),
    title,
  };

  postTodoHandler(todo);
});

// Reverse btn
let reversed = false;
sortEl.addEventListener("click", function (e) {
  e.preventDefault();
  renderData(todos, !reversed);
  reversed = !reversed;
});

// Edit list
let currentTodo;
let currentTodoIndex;
let changedTodo;

listContainer.addEventListener("click", function (e) {
  e.preventDefault();
  // Event delegation

  const allParents = document.querySelectorAll(".todo__list");
  const allEditBtns = document.querySelectorAll(".btn__edit");

  const clickedBtnEdit = e.target.closest(".btn__edit");
  const clickedBtnDelete = e.target.closest(".btn__delete");
  const clickedBtnCancel = e.target.closest(".btn__cancel");

  if (!clickedBtnCancel && !clickedBtnDelete && !clickedBtnEdit) {
    return;
  }
  const { id } = e.target.dataset;
  const parent = e.target.closest(".todo__list");

  if (clickedBtnEdit) {
    editHandler.call(clickedBtnEdit, id, parent, allParents, allEditBtns);
  }

  if (clickedBtnDelete) {
    deleteHandler(id, parent);
  }

  if (clickedBtnCancel) {
    cancelHandler.call(clickedBtnCancel, id, parent, allEditBtns);
  }
});

changeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (isEmpty(titleEl.value, statusEl.value)) {
    displayElement(posAbsoluteContainer, "Please complete fields");
    return;
  }
  if (!isBoolean(statusEl.value)) {
    statusEl.focus();
    displayElement(posAbsoluteContainer, "Please enter true or false");
    return;
  }

  changedTodo = {
    id: currentTodo.id,
    title: titleEl.value,
    completed: statusEl.value,
  };

  todos.splice(currentTodoIndex, 1, changedTodo);

  renderData(todos);
  clearInput(titleEl, statusEl);
  displayElement(posAbsoluteContainer, "successfully changed");
  submitBtn.classList.remove("hidden");
  changeBtn.classList.add("hidden");

  submitTodoHeading.innerText = "Submit todo";
});
