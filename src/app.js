const express = require('express');
const morgan = require('morgan');
const app = express();
const v1Routes = require('./routes/v1');
const errorHandler = require('./middlewares/error.middleware');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/api/v1', v1Routes);
app.use(errorHandler);


module.exports = app;