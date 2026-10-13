const addButton = document.querySelector('button');
const todoInput = document.querySelector('input');
const todoList = document.querySelector('ul');
const message = document.getElementById('message');
const serverCheckButton = document.getElementById('server-check');
const serverMessage = document.getElementById('server-message');
let todos = [];
let isBusy = false;

function setBusy(busy) {
    isBusy = busy;
    addButton.disabled = busy;
    todoInput.disabled = busy;
    todoList.querySelectorAll('button').forEach(function (button) {
        button.disabled = busy;
    });
}

async function requestTodos(options, id) {
    const url = '/api/todos' + (id === undefined ? '' : '/' + encodeURIComponent(id));
    const response = await fetch(url, { cache: 'no-store', ...options });
    if (!response.ok) {
        throw new Error('Todo request failed');
    }
    return response.json();
}

async function updateTodos(options, id) {
    if (isBusy) return false;
    setBusy(true);
    message.hidden = true;
    try {
        todos = await requestTodos(options, id);
        renderTodos();
        return true;
    } catch (error) {
        message.textContent = '서버에서 할 일 목록을 불러오거나 변경하지 못했습니다. 서버 연결을 확인한 뒤 다시 시도해 주세요.';
        message.hidden = false;
        return false;
    } finally {
        setBusy(false);
    }
}

function renderTodos() {
    todoList.replaceChildren();

    todos.forEach(function (todo) {
        const todoItem = document.createElement('li');
        const todoText = document.createElement('span');
        todoText.textContent = todo.text;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '삭제';
        deleteButton.setAttribute('aria-label', todo.text + ' 삭제');
        deleteButton.addEventListener('click', function () {
            updateTodos({ method: 'DELETE' }, todo.id);
        });

        todoItem.append(todoText, deleteButton);
        todoList.appendChild(todoItem);
    });
}

updateTodos();

addButton.addEventListener('click', async function () {
    if (todoInput.value.trim() === '') {
        return;
    }

    const saved = await updateTodos({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todoInput.value.trim() })
    });
    if (saved) todoInput.value = '';
});

serverCheckButton.addEventListener('click', async function () {
    serverCheckButton.disabled = true;
    serverMessage.textContent = '서버를 확인하고 있습니다…';
    serverMessage.hidden = false;

    try {
        const response = await fetch('/api/server-check', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Server check failed');
        }
        serverMessage.textContent = await response.text();
    } catch (error) {
        serverMessage.textContent = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.';
    } finally {
        serverCheckButton.disabled = false;
    }
});
