const http = require('http');
const debug = require('debug');
const app = require('./app');
require('dotenv').config();

const DEBUG = debug('dev');
const PORT = process.env.NODE_ENV === 'test' ? 7647 : process.env.PORT || 5000;
const server = http.createServer(app);

process.on('uncaughtException', error => {
  DEBUG(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  DEBUG(err);
  DEBUG('Unhandled Rejection:', {
    name: err.name,
    message: err.message || err,
  });
  process.exit(1);
});

server.listen(PORT, () => {
  DEBUG(
    `server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode.\nPress CTRL-C to stop`,
  );
});
