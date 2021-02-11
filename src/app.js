const express = require('express');
const { config } = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
// const routes = require('./routes');

config();

const app = express();

app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());

// app.use('/api/v1', routes);

app.get('/', (_, response) => {
  response.status(200).json({
    status: 'success',
    message: 'Welcome',
  });
});

app.all('*', (request, response) => {
  response.status(404).json({
    status: 'error',
    error: 'resource not found',
  });
});

app.use(errorHandler);

module.exports = app;
