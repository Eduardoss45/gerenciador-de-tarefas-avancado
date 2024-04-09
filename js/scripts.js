// Selecione elementos
const todoForm = document.querySelector("#todo-form"); // Selecione o formulário de tarefas
const todoInput = document.querySelector("#todo-input"); // Selecione o campo de entrada para novas tarefas
const todoList = document.querySelector("#todo-list"); // Selecione a lista que exibirá as tarefas
const editForm = document.querySelector("#edit-form"); // Selecione o formulário para editar tarefas
const editInput = document.querySelector("#edit-input"); // Selecione o campo de entrada para editar tarefas
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); // Selecione o botão para cancelar o modo de edição
const searchInput = document.querySelector("#search-input"); // Selecione o campo de entrada para pesquisar tarefas
const eraseBtn = document.querySelector("#erase-button"); // Selecione o botão para apagar a entrada de pesquisa
const filterBtn = document.querySelector("#filter-select"); // Selecione o elemento de seleção para filtrar tarefas

let oldInputValue; // Armazene o valor antigo da tarefa que está sendo editada

// Funções
const saveTodo = (text, done = 0, save = 1) => {
  // Crie um novo elemento de tarefa e anexe-o à lista de tarefas
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilize dados do localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  // Alterne a visibilidade do formulário de tarefas, formulário de edição e lista de tarefas
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  // Atualize o texto da tarefa que está sendo editada
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchTodos = (search) => {
  // Filtre as tarefas com base na entrada de pesquisa
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  // Filtre as tarefas com base no valor de filtro selecionado
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex "));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
        ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        todo.classList.contains("done")
        ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3");
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    saveTodoLocalStorage(
      { text: todoTitle.innerText, done: parentEl.classList.contains("done") },
      parentEl.dataset.todoId
    );
  }

  if (targetEl.classList.contains("edit-todo")) {
    oldInputValue = todoTitle.innerText;
    editInput.value = oldInputValue;

    toggleForms();
  }

  if (targetEl.classList.contains("remove-todo")) {
    removeTodoLocalStorage(parentEl.dataset.todoId);
    parentEl.remove();
  }
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newText = editInput.value;

  if (newText && newText !== oldInputValue) {
    updateTodo(newText);
  }

  toggleForms();
});

cancelEditBtn.addEventListener("click", () => {
  toggleForms();
});

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value;

  if (searchValue) {
    getSearchTodos(searchValue);
  } else {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => (todo.style.display = "flex"));
  }
});

eraseBtn.addEventListener("click", () => {
  searchInput.value = "";
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => (todo.style.display = "flex"));
});

filterBtn.addEventListener("change", () => {
  const filterValue = filterBtn.value;

  filterTodos(filterValue);
});