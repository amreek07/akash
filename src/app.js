const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const v1Routes = require('./routes/v1');
const errorHandler = require('./middlewares/error.middleware');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/api/v1', v1Routes);
app.use(errorHandler);

app.use(express.static('frontend/dist'));
app.use('/uploads', express.static('uploads'));
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html')); // relative path
});


module.exports = app;