const database = require('../util/inmem-db');
const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/mysql-db');
const jwt = require('jsonwebtoken');

const userController = {
  getAllUsers: (req, res, next) => {
    logger.info('Get all users');

    let sqlStatement = 'SELECT * FROM `user`';
    // Hier wil je misschien iets doen met mogelijke filterwaarden waarop je zoekt.
    if (req.query.isactive) {
      // voeg de benodigde SQL code toe aan het sql statement
      // bv sqlStatement += " WHERE `isActive=?`"
    }

    pool.getConnection(function(err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, function(err, results, fields) {
          if (err) {
            logger.err(err.message);
            next({
              code: 409,
              message: err.message
            });
          }
          if (results) {
            logger.info('Found', results.length, 'results');
            res.status(200).json({
              code: 200,
              message: 'User getAll endpoint',
              data: results
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  },

  getUserProfile: (req, res, next) => {
    req.userId = 1;
    logger.trace('Get user profile for user', req.userId);

    let sqlStatement = 'SELECT * FROM `user` WHERE id=?';

    pool.getConnection(function(err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, [req.userId], (err, results, fields) => {
          if (err) {
            logger.error(err.message);
            next({
              code: 409,
              message: err.message
            });
          }
          if (results) {
            logger.trace('Found', results.length, 'results');
            res.status(200).json({
              code: 200,
              message: 'Get User profile',
              data: results[0]
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  },

  createUser: (req, res, next) => {
    logger.info('Register user');

    // De usergegevens zijn meegestuurd in de request body.
    const user = req.body;
    logger.trace('user = ', user);

    // Hier zie je hoe je binnenkomende user info kunt valideren.
    try {
      // assert(user === {}, 'Userinfo is missing');
      assert(typeof user.firstName === 'string', 'firstName must be a string');
      assert(
        typeof user.emailAdress === 'string',
        'emailAddress must be a string'
      );
    } catch (err) {
      logger.warn(err.message.toString());
      // Als één van de asserts failt sturen we een error response.
      next({
        code: 400,
        message: err.message.toString(),
        data: undefined
      });

      // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
      // wanneer er al een response is teruggestuurd.
      return;
    }

    /**
     * De rest van deze functie maak je zelf af!
     * Voor tips, zie de PDF van de les over authenticatie.
     */
  },
  getUserById: (req, res, next) => {
    const userId = req.params.id;
    logger.trace('Get user by ID:', userId);

    let sqlStatement = 'SELECT * FROM `user` WHERE id=?';

    pool.getConnection(function(err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, [userId], (err, results, fields) => {
          if (err) {
            logger.error(err.message);
            next({
              code: 409,
              message: err.message
            });
          }
          if (results && results.length > 0) {
            logger.trace('Found user:', results[0]);
            res.status(200).json({
              code: 200,
              message: 'Get user by ID',
              data: results[0]
            });
          } else {
            next({
              code: 404,
              message: 'User not found'
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  },

  updateUser: (req, res, next) => {
    const userId = req.params.id;
    const userData = req.body;
    logger.trace('Update user:', userId);

    let sqlStatement = 'UPDATE `user` SET ? WHERE id=?';

    pool.getConnection(function(err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, [userData, userId], (err, results, fields) => {
          if (err) {
            logger.error(err.message);
            next({
              code: 409,
              message: err.message
            });
          } else if (results.affectedRows > 0) {
            logger.trace('User updated:', results);
            res.status(200).json({
              code: 200,
              message: 'User updated successfully',
              data: results
            });
          } else {
            next({
              code: 404,
              message: 'User not found'
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  },

  deleteUser: (req, res, next) => {
    const userId = req.params.id;
    logger.trace('Delete user:', userId);

    let sqlStatement = 'DELETE FROM `user` WHERE id=?';

    pool.getConnection(function(err, conn) {
      // Do something with the connection
      if (err) {
        logger.error(err.code, err.syscall, err.address, err.port);
        next({
          code: 500,
          message: err.code
        });
      }
      if (conn) {
        conn.query(sqlStatement, [userId], (err, results, fields) => {
          if (err) {
            logger.error(err.message);
            next({
              code: 409,
              message: err.message
            });
          } else if (results.affectedRows > 0) {
            logger.trace('User deleted:', results);
            res.status(200).json({
              code: 200,
              message: 'User deletedsuccessfully',
              data: results
            });
          } else {
            next({
              code: 404,
              message: 'User not found'
            });
          }
        });
        pool.releaseConnection(conn);
      }
    });
  }
};

module.exports = userController;