// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const tagInput = document.querySelector('.tag-input'); 
const priorityLevel = document.querySelector('#priorityLevel');
const toDoList = document.querySelector('.todo-list');
const listCategory = document.querySelector('#listCategory');
const themeSelectors = document.querySelectorAll('.theme-selector');
const dueDateInput = document.querySelector('.due-date-input');
const reminderInput = document.querySelector('.reminder-input');

// Variables
let activeCategory = localStorage.getItem('activeCategory') || 'Work';
let savedTheme = localStorage.getItem('savedTheme') || 'standard';

// Initial Functions
changeTheme(savedTheme);
displayTodos();

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
listCategory.addEventListener('change', changeCategory);
themeSelectors.forEach(selector => {
    selector.addEventListener('click', () => changeTheme(selector.classList[0].split('-')[0]));
});
document.addEventListener("DOMContentLoaded", getTodos);

// Functions
function addToDo(event) {
    event.preventDefault();
    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // New Task
    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    // New Elements for Due Date and Reminder
    const dueDate = dueDateInput.value;
    const reminder = reminderInput.value;

    if (dueDate) {
        const dueDateElement = document.createElement('span');
        dueDateElement.innerText = `Due: ${dueDate}`;
        dueDateElement.classList.add('due-date-item');
        toDoDiv.appendChild(dueDateElement);
    }

    if (reminder) {
        const reminderElement = document.createElement('span');
        reminderElement.innerText = `Reminder: ${new Date(reminder).toLocaleString()}`;
        reminderElement.classList.add('reminder-item');
        toDoDiv.appendChild(reminderElement);
    }

    // Add check and delete buttons
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append to list and save to localStorage
    toDoList.appendChild(toDoDiv);
    saveLocal(toDoInput.value, activeCategory, tagInput.value, priorityLevel.value, dueDate, reminder);

    // Reset form inputs
    toDoInput.value = '';
    tagInput.value = '';
    priorityLevel.value = 'Low';
    dueDateInput.value = '';
    reminderInput.value = '';
}


// Check reminders every minute
setInterval(() => {
    const todos = JSON.parse(localStorage.getItem(activeCategory)) || [];
    todos.forEach(todo => {
        if (todo.reminder) {
            const now = new Date();
            const reminderTime = new Date(todo.reminder);
            if (reminderTime <= now && !todo.alerted) {
                alert(`Reminder: ${todo.text} is due soon!`);
                todo.alerted = true; // Set alerted to true to prevent repeat alerts
                localStorage.setItem(activeCategory, JSON.stringify(todos));
            }
        }
    });
}, 60000);

function deletecheck(event) {
    const item = event.target;
    if (item.classList.contains('delete-btn')) {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        item.parentElement.addEventListener('transitionend', () => item.parentElement.remove());
    } else if (item.classList.contains('check-btn')) {
        item.parentElement.classList.toggle("completed");
        updateTodoStatus(item.parentElement);
    }
}

function updateTodoStatus(todoDiv) {
    const todos = JSON.parse(localStorage.getItem(activeCategory)) || [];
    const todoText = todoDiv.querySelector('.todo-item').innerText;
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex > -1) {
        todos[todoIndex].completed = todoDiv.classList.contains("completed");
        localStorage.setItem(activeCategory, JSON.stringify(todos));
    }
}

function saveLocal(todo, category, tag, priority, dueDate, reminder) {
    let todos = JSON.parse(localStorage.getItem(category)) || [];
    todos.push({ text: todo, tag, priority, dueDate, reminder, completed: false });
    localStorage.setItem(category, JSON.stringify(todos));
}

function getTodos() {
    const todos = JSON.parse(localStorage.getItem(activeCategory)) || [];
    todos.forEach(function(todo) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);
        
        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const tagElement = document.createElement('span');
        tagElement.innerText = `Tag: ${todo.tag}`;
        tagElement.classList.add('tag-item');
        toDoDiv.appendChild(tagElement);

        const priorityElement = document.createElement('span');
        priorityElement.innerText = `Priority: ${todo.priority}`;
        priorityElement.classList.add('priority-item');
        toDoDiv.appendChild(priorityElement);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}

function displayTodos() {
    toDoList.innerHTML = '';
    const todos = JSON.parse(localStorage.getItem(activeCategory)) || [];
    todos.forEach(todo => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);
        if (todo.completed) {
            toDoDiv.classList.add("completed");
        }

        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const tagElement = document.createElement('span');
        tagElement.innerText = `Tag: ${todo.tag}`;
        tagElement.classList.add('tag-item');
        toDoDiv.appendChild(tagElement);

        const priorityElement = document.createElement('span');
        priorityElement.innerText = `Priority: ${todo.priority}`;
        priorityElement.classList.add('priority-item');
        toDoDiv.appendChild(priorityElement);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}


function changeCategory() {
    activeCategory = listCategory.value;
    if (activeCategory === "New") {
        const newCategory = prompt("Enter new list name:");
        if (newCategory && !document.querySelector(`option[value="${newCategory}"]`)) {
            const newOption = document.createElement("option");
            newOption.value = newCategory;
            newOption.innerText = newCategory;
            listCategory.appendChild(newOption);
            listCategory.value = newCategory;
            activeCategory = newCategory;
        }
    }
    localStorage.setItem('activeCategory', activeCategory);
    displayTodos();
}

function removeLocalTodos(todo) {
    const todos = JSON.parse(localStorage.getItem(activeCategory)) || [];
    const todoIndex = todos.indexOf(todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem(activeCategory, JSON.stringify(todos));
}

function changeTheme(color) {
    savedTheme = color;
    localStorage.setItem('savedTheme', color);
    document.body.className = color;
    document.querySelector('input').className = `${color}-input`;
    document.querySelector('.list-category').className = `list-category ${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = `todo ${color}-todo${todo.classList.contains('completed') ? ' completed' : ''}`;
    });
    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        }
    });
}
