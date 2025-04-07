let tasks = [];
let filter = 'all';

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        input.value = "";
        renderTasks();
    }
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        const span = document.createElement("span");
        span.textContent = task.text;
        span.onclick = () => toggleTask(index);

        li.appendChild(span);
        list.appendChild(li);
    });

    document.getElementById("taskCount").textContent = tasks.filter(t => !t.completed).length;
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function filterTasks(selectedFilter) {
    filter = selectedFilter;
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach(btn => btn.classList.remove("active-filter"));
    document.querySelector(`.filters button:nth-child(${selectedFilter === 'all' ? 1 : selectedFilter === 'active' ? 2 : 3})`).classList.add("active-filter");
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

renderTasks();
