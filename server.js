// express-server.js
const express = require('express');
const app = express();
const port = 3001;

app.get('/api/data', (req, res) => {
    // ここでデータを非同期に取得・処理
    const data = { message: 'Hello from Express API!' };
    res.json(data);
});

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});
