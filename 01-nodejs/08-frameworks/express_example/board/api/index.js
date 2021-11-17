const express = require('express');
const db = require('./db');
const app = express();

app.get('/', (req, res) => {
    console.log('/api get');
    res.send('API get test');
});

app.post('/', (req, res) => {
    console.log('/api post');
    res.send('API post test');
});

module.exports = {
    path: '/api',
    handler: app
}
