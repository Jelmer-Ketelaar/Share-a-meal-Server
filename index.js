const express = require('express');
const logger = require('./src/util/utils').logger;
const userRoutes = require('./src/routes/user.routes');

const app = express();
const port = process.env.PORT || 3000;

// Toegang krijgen tot het JSON-request body van de applicatie.
app.use(express.json());

// het loggen van alle requests
app.use('*', (req, res, next) => {
  const requestMethod = req.method;
  logger.trace(`Request method ${requestMethod} called`);
  next();
});

// Info endpoint
app.get('/api/info', (req, res) => {
  logger.info('Get server information');
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'Jelmer Ketelaar',
      studentNumber: 1234567,
      description: 'Welcome to the Share-a-Meal server API.'
    }
  });
});

// Router for /api/user endpoints
const userRouter = express.Router();
app.use('/api/user', userRouter);
userRouter.use('/', userRoutes);

// 404 error handler voor niet bestaande endpoints
app.use((req, res, next) => {
  const error = new Error(`Endpoint not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Express error handler
app.use((err, req, res, next) => {
  logger.error(err.statusCode, err.message);
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message,
    data: {}
  });
});

// Start the server
app.listen(port, () => {
  logger.info(`Share-a-Meal server listening on port ${port}`);
});

// Export de server voor tests
module.exports = app;