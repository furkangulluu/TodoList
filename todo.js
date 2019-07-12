const form = document.querySelector("#todo-form");
const alertbox = document.querySelector(".alertbox");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");
const listMessage = document.querySelector("#listMessage");

eventListener();
function eventListener() {

    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo);
    });
    checkTodoListForHide();
}

function deleteTodo(e) {
    if (e.target.className == "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "TODO Deleting Successful");
        checkTodoListForHide();
    }

    e.preventDefault();
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute("style", "display: none !important");
        }
        else {
            listItem.setAttribute("style", "display: block")
        }
    })
}

function clearAllTodos(e) {
    if (confirm("Are you sure want to delete all of these?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
        checkTodoListForHide();
    }
}

function deleteTodoFromStorage(textContent) {

    let todos = getTodosFromStorage();
    todos.forEach(function (todo, index) { //index: ilgili value'nun index numarası(indisi)
        if (todo === textContent) {
            todos.splice(index, 1); //splice array'deki ilgili index'i siler
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {

        showAlert("danger", "Please entry a todo..");
    }
    else {
        let isTodo = checkTodo(newTodo);

        if (isTodo) {
            showAlert("danger", `You have already same TODO as ${newTodo}`)
        } else {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success", "Adding Successful");
            checkTodoListForHide();
        }
    }
    e.preventDefault();
}

function checkTodo(newTodo) {
    let todos;
    let returnValue = false;
    todos = getTodosFromStorage();
    for (let item in todos) {
        if (newTodo.toLowerCase() === todos[item].toLowerCase()) {
            returnValue = true;
        }
    }
    return returnValue;
}

function addTodoToUI(newTodo) {
    //List Item Oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    //Link Oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = '<i class = "fa fa-remove"></i>';
    //<a> yı <li> ye append ile ekledik
    listItem.appendChild(link);
    //<li> yi <ul> ye append ile ekledik
    todoList.appendChild(listItem);
    todoInput.value = "";
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    return todos;
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.style = "position: fixed; z-index:1000;";
    alert.textContent = message;
    alertbox.appendChild(alert);
    setTimeout(function () {
        alert.remove();
    }, 3000)
}

function checkTodoListForHide() {
    let todos = getTodosFromStorage();
    if (todos.length===0) {
        secondCardBody.setAttribute("style", "display: none");
        listMessage.setAttribute("style", "display: block");
    }
    else{
        secondCardBody.setAttribute("style", "display: block");
        listMessage.setAttribute("style", "display: none");
    }
}
