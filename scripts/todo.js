import { baseUrl } from "./baseUrl.js";
import { logout } from "./logout.js";
let form = document.getElementById("form");
document.getElementById("close_modal").addEventListener("click", function () {
  addTodoDiv.style.display = "none";
});
let addTodoDiv = document.getElementById("add-todo");
document.getElementById("add_todo_btn").addEventListener("click", function () {
  addTodoDiv.style.display = "flex";
});

logout();
let loginData = JSON.parse(localStorage.getItem("loginData"));

form.addEventListener("submit", function () {
  alert("clicked");
  event.preventDefault();
  let title = form.title.value;
  let deadline = form.deadline.value;
  let priority = form.priority.value;
  let todoObj = {
    title,
    deadline,
    priority,
    status: false,
    userId: loginData.id,
  };
  // console.log(todoObj)
  let method = form.submit.value == "Add Todo" ? "POST" : "PATCH";
  let url =
    method == "POST"
      ? `${baseUrl}/todos`
      : `${baseUrl}/todos/${form.todoId.value}`;
  let message = method == "POST" ? "Todo Added" : "Todo Updated...";
  // console.log(method, url)
  // // push or edit this todo to json server
  fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(todoObj),
  })
    .then(() => {
      alert(message);
      loadData();
      addTodoDiv.style.display = "none";
    })
    .catch((err) => {
      alert("Something went wrong");
      console.log(err);
    })
    .finally(() => {
      form.reset();
    });
});

async function getTodos() {
  try {
    let res = await fetch(`${baseUrl}/todos`);
    let data = await res.json();
    let userTodos = data.filter((el, i) => el.userId == loginData.id);
    return userTodos;
  } catch (err) {
    console.log(err);
    alert("Something went wrong in getting Todos");
  }
}

function displayTodos(arr) {
  let cont = document.getElementById("todo-container");
  cont.innerHTML = "";

  arr.map((el, i) => {
    let card = document.createElement("div");
    card.setAttribute("class", "todo-card");

    let title = document.createElement("h5");
    title.textContent = `Title: ${el.title}`;

    let deadline = document.createElement("h5");
    deadline.textContent = `Deadline: ${el.deadline}`;

    let d = new Date(el.deadline);
    if (d < Date.now() && el.status == false) {
      card.classList.add("pending");
    }
    let priority = document.createElement("h5");
    priority.textContent = `Priority: ${el.priority}`;

    let status = document.createElement("h5");
    status.textContent =
      el.status == true ? "Status: Completed" : "Status: Pending";

    let updateStatusButton = document.createElement("button");
    updateStatusButton.setAttribute("class", "todobtns");
    updateStatusButton.textContent = `Toggle Status`;
    updateStatusButton.addEventListener("click", function () {
      updateStatusFn(el, i);
    });

    let editTodoButton = document.createElement("button");
    editTodoButton.setAttribute("class", "todobtns");
    editTodoButton.textContent = `Edit Todo`;
    editTodoButton.addEventListener("click", function () {
      openModal(el);
    });

    let deleteTodoButton = document.createElement("button");
    deleteTodoButton.setAttribute("class", "todobtns");
    deleteTodoButton.textContent = `Delete Todo`;
    deleteTodoButton.addEventListener("click", function () {
      deleteTodoFn(el, i);
    });
    card.append(
      title,
      priority,
      deadline,
      status,
      editTodoButton,
      updateStatusButton,
      deleteTodoButton
    );
    cont.append(card);
  });
}

function openModal(todo) {
  document.getElementById("add_update_todo").textContent = "Edit Todo";
  addTodoDiv.style.display = "flex";
  form.todoId.value = todo.id;
  form.title.value = todo.title;
  form.deadline.value = todo.deadline;
  form.priority.value = todo.priority;
  form.submit.value = "Edit Todo";
}
window.onload = async () => {
  let arr = await getTodos();
  displayTodos(arr);
};

async function loadData() {
  let arr = await getTodos();
  displayTodos(arr);
}
function updateStatusFn(el, i) {
  let updatedTodo = { ...el, status: !el.status };

  let todoId = el.id;
  fetch(`${baseUrl}/todos/${todoId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  })
    .then(() => {
      alert("Todo Updated....");
      /// reload to get updated data
      // window.location.reload()
      // or else call loadData funtion
      loadData();
    })
    .catch((err) => {
      alert("Something went wrong in updation");
      console.log(err);
    });
}

function deleteTodoFn(el, i) {
  let todoId = el.id;
  fetch(`${baseUrl}/todos/${todoId}`, {
    method: "DELETE",
  })
    .then(() => {
      alert("Todo Deleted....");
      /// reload to get updated data
      // window.location.reload()
      // or else call loadData funtion
      loadData();
    })
    .catch((err) => {
      alert("Something went wrong in updation");
      console.log(err);
    });
}

document
  .getElementById("get_stats")
  .addEventListener("click", async function () {
    let data = await getTodos();
    let completedTasks = data.filter((el) => el.status == true).length;
    let pendingTasks = data.filter((el) => el.status == false).length;
    let HighPriorityTasks = data.filter((el) => el.priority == "high").length;
    let MedPriorityTasks = data.filter((el) => el.priority == "medium").length;
    let lowPriorityTasks = data.filter((el) => el.priority == "low").length;

    let card = `
    <style>
      #get_stats_data{
        font-size: 1rem;
        text-align: center;
        display:flex;
        flex-direction:column;
        align-items:start;
        justify-content:center;
        padding-left:5px;
      }
      #get_stats_data>h3{
      margin-bottom:5px;
      color: blueviolet;
      }
       
    </style>
    
    <div id="get_stats_data">
       <h2> Here is Summary of the Tasks created by <span> ${loginData.username} </span> </h2>
       <h3> Completed Tasks: ${completedTasks}</h3>
       <h3> Pending Tasks: ${pendingTasks}</h3>
       <h3> High PriorityTasks: ${HighPriorityTasks}</h3>
       <h3>Med Priority Tasks: ${MedPriorityTasks}</h3>
       <h3> Low Priority Tasks: ${lowPriorityTasks}</h3>
    </div>`;
    addTodoDiv.style.display = "flex";
    document.getElementById("modal_content").innerHTML = card;
  });