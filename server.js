const express = require('express');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const port = 3000;
// 프로젝트 폴더의 파일에 저장하므로 서버를 재시작해도 목록이 유지됩니다.
const db = new DatabaseSync(path.join('/tmp', 'todos.db'));
db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL CHECK (length(trim(text)) > 0)
    )
`);
const selectTodos = db.prepare('SELECT id, text FROM todos ORDER BY id');
const insertTodo = db.prepare('INSERT INTO todos (text) VALUES (?)');
const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ?');
process.on('exit', function () {
    db.close();
});

app.use(express.json());
app.use('/api', function (req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
});

app.get('/api/todos', function (req, res) {
    res.json(selectTodos.all());
});

app.post('/api/todos', function (req, res) {
    const text = req.body && req.body.text;
    if (typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: '할 일을 입력해 주세요.' });
    }
    insertTodo.run(text.trim());
    res.status(201).json(selectTodos.all());
});

app.delete('/api/todos/:id', function (req, res) {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ error: '올바른 할 일 번호가 아닙니다.' });
    }
    const result = deleteTodo.run(id);
    if (result.changes === 0) {
        return res.status(404).json({ error: '해당 할 일을 찾을 수 없습니다.' });
    }
    res.json(selectTodos.all());
});

app.get('/api/server-check', function (req, res) {
    res.set('Cache-Control', 'no-store');
    res.type('text/plain').send('서버가 정상적으로 작동하고 있습니다.');
});

// 기존 화면 파일만 브라우저에 제공합니다.
app.get(['/', '/index.html'], function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'script.js'));
});

const server = app.listen(port, '127.0.0.1', function () {
    console.log('To-Do 앱: http://127.0.0.1:' + port);
    console.log('서버를 종료하려면 Ctrl+C를 누르세요.');
});

server.on('error', function (error) {
    if (error.code === 'EADDRINUSE') {
        console.error('3000번 포트를 사용 중입니다. 기존 서버를 종료한 뒤 다시 실행하세요.');
    } else {
        console.error('서버 실행 오류:', error.message);
    }
    process.exitCode = 1;
});
