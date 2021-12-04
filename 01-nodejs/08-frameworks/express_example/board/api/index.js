const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/manage', require('./manage'));

module.exports = {
    path: '/api',
    handler: app
}
