const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('API get test');
});
app.post('/', (req, res) => {
    res.send('API post test');
});

app.use('/manage', require('./manage'));
//app.use('/board', require('./board'))

module.exports = {
    path: '/api',
    handler: app
}
