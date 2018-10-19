const express = require('express');
const app = express();
const morgan = require('morgan');
const { handler } = require('./util/errors');
// const { HttpError } = require('./util/errors');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const tours = require('./routes/tours');

app.use('/api/tours', tours);

app.use((req, res) => {
    console.log('This is 404');
    res.status(404);
    res.end('404 Not Found');
});

app.use(handler);

module.exports = app;
