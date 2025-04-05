// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const allBtn = document.getElementById('allBtn');
const activeBtn = document.getElementById('activeBtn');
const completedBtn = document.getElementById('completedBtn');
const remainingCount = document.getElementById('remainingCount');

// State
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    updateRemainingCount();
});

// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodo());

allBtn.addEventListener('click', () => setFilter('all'));
activeBtn.addEventListener('click', () => setFilter('active'));
completedBtn.addEventListener('click', () => setFilter('completed'));

// Functions
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const todo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    renderTodoItem(todo);
    saveTodos();
    todoInput.value = '';
    updateRemainingCount();
}

function renderTodoItem(todo) {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item fade-in ${todo.completed ? 'completed' : ''}`;
    todoItem.dataset.id = todo.id;

    todoItem.innerHTML = `
        <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <div class="actions">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add event listeners
    const checkbox = todoItem.querySelector('.checkbox');
    const todoText = todoItem.querySelector('.todo-text');
    const editBtn = todoItem.querySelector('.edit-btn');
    const deleteBtn = todoItem.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => toggleComplete(todo.id));
    todoText.addEventListener('click', () => toggleComplete(todo.id));
    editBtn.addEventListener('click', () => editTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    // Apply filter visibility
    applyFilterVisibility(todoItem, todo);

    todoList.appendChild(todoItem);
}

function toggleComplete(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    todoItem.classList.toggle('completed');
    
    const checkbox = todoItem.querySelector('.checkbox');
    checkbox.checked = todoItem.classList.contains('completed');
    
    saveTodos();
    updateRemainingCount();
}

function editTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const todoText = todoItem.querySelector('.todo-text');
    const currentText = todoText.textContent;
    const editBtn = todoItem.querySelector('.edit-btn');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    const saveButton = document.createElement('button');
    saveButton.className = 'edit-btn';
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    
    todoItem.replaceChild(input, todoText);
    todoItem.querySelector('.actions').replaceChild(saveButton, editBtn);
    input.focus();

    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText) {
            todoText.textContent = newText;
            todoItem.replaceChild(todoText, input);
            todoItem.querySelector('.actions').replaceChild(editBtn, saveButton);
            saveTodos();
        }
    };

    input.addEventListener('keypress', (e) => e.key === 'Enter' && saveEdit());
    saveButton.addEventListener('click', saveEdit);
}

function deleteTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    todoItem.classList.add('fade-out');
    
    setTimeout(() => {
        todoItem.remove();
        saveTodos();
        updateRemainingCount();
    }, 300);
}

function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    [allBtn, activeBtn, completedBtn].forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${filter}Btn`).classList.add('active');
    
    // Apply filter to all todo items
    document.querySelectorAll('.todo-item').forEach(item => {
        const isCompleted = item.classList.contains('completed');
        applyFilterVisibility(item, { completed: isCompleted });
    });
}

function applyFilterVisibility(todoItem, todo) {
    switch (currentFilter) {
        case 'active':
            todoItem.style.display = todo.completed ? 'none' : 'flex';
            break;
        case 'completed':
            todoItem.style.display = todo.completed ? 'flex' : 'none';
            break;
        default:
            todoItem.style.display = 'flex';
    }
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        todos.push({
            id: parseInt(item.dataset.id),
            text: item.querySelector('.todo-text').textContent,
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => renderTodoItem(todo));
}

function updateRemainingCount() {
    const count = document.querySelectorAll('.todo-item:not(.completed)').length;
    remainingCount.textContent = count;
    document.title = `(${count}) Todo App`;
}