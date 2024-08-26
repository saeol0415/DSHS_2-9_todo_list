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
        const id = taskIdField.value || '';
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
        } else {
            alert('Title and Due Date are required!');
        }
    });

    function saveTask(task) {
        const method = task.id ? 'PUT' : 'POST';
        fetch(`http://localhost:3000/tasks${task.id ? '/' + task.id : ''}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(data => {
            renderTasks();
            taskForm.classList.add('hidden');
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteTask(taskId) {
        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            renderTasks();
        })
        .catch(error => console.error('Error:', error));
    }

    function editTask(taskId) {
        fetch(`http://localhost:3000/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            taskIdField.value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDueDate').value = task.dueDate;

            taskForm.classList.remove('hidden');
        })
        .catch(error => console.error('Error:', error));
    }

    function clearForm() {
        taskIdField.value = '';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDueDate').value = '';
    }

    function renderTasks() {
        tasksContainer.innerHTML = '';
        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
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
        })
        .catch(error => console.error('Error:', error));
    }

    renderTasks();

    window.editTask = editTask;
    window.deleteTask = deleteTask;
});
