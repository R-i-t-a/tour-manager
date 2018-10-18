const app = express();
const express = require('express');
const morgan = require('morgan');
const { handler } = require('./util/errors');
// const { HttpError } = require('./util/errors');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const events = require('./routes/events');

app.use('/api/events', events);

app.use((req, res) => {
    console.log('This is 404');
    res.status(404);
    res.end('404 Not Found');
});

app.use(handler);

module.exports = app;
