document.addEventListener("DOMContentLoaded", () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const taskForm = document.getElementById('taskForm');
    const saveTaskButton = document.getElementById('saveTaskButton');
    const tasksContainer = document.getElementById('tasksContainer');
    const taskIdField = document.getElementById('taskId');

    addTaskButton.addEventListener('click', () => {
        taskForm.classList.toggle('hidden');
        clearForm();
    });

    saveTaskButton.addEventListener('click', () => {
        const id = taskIdField.value || Date.now().toString();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (title && dueDate) {
            const task = {
                id,
                title,
                description,
                dueDate
            };
            saveTask(task);
            renderTasks();
            taskForm.classList.add('hidden');
        } else {
            alert('Title and Due Date are required!');
        }
    });

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const existingTaskIndex = tasks.findIndex(t => t.id === task.id);

        if (existingTaskIndex > -1) {
            tasks[existingTaskIndex] = task;
        } else {
            tasks.push(task);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function deleteTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function editTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(task => task.id === taskId);

        if (task) {
            taskIdField.value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDueDate').value = task.dueDate;

            taskForm.classList.remove('hidden');
        }
    }

    function clearForm() {
        taskIdField.value = '';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDueDate').value = '';
    }

    function renderTasks() {
        tasksContainer.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <small>Due: ${task.dueDate}</small>
                <div class="actions">
                    <button onclick="editTask('${task.id}')">Edit</button>
                    <button onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            `;
            tasksContainer.appendChild(taskElement);
        });
    }

    renderTasks();

    window.editTask = editTask;  // Expose editTask to global scope
    window.deleteTask = deleteTask;  // Expose deleteTask to global scope
});
