const database = require('../util/database');
const logger = require('../util/utils').logger;
const assert = require('assert');

const userController = {
  getAllUsers: (req, res, next) => {
    logger.info('Get all users');
    // er moet precies 1 response verstuurd worden.
    const statusCode = 200;
    res.status(statusCode).json({
      status: statusCode,
      message: 'User getAll endpoint',
      data: database.users
    });
  },

  createUser: (req, res) => {
    logger.info('Register user');

    // De usergegevens zijn meegestuurd in de request body.
    // In de komende lessen gaan we testen of dat werkelijk zo is.
    const user = req.body;
    logger.debug('user = ', user);

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
      res.status(400).json({
        status: 400,
        message: err.message.toString(),
        data: {}
      });
      // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
      // wanneer er al een response is teruggestuurd.
      return;
    }

    // Zorg dat de id van de nieuwe user toegevoegd wordt
    // en hoog deze op voor de volgende insert.
    user.id = database.index++;
    // User toevoegen aan database
    database['users'].push(user);
    logger.info('New user added to database');

    // Stuur het response terug
    res.status(200).json({
      status: 200,
      message: `User met id ${user.id} is toegevoegd`,
      // Wat je hier retourneert is een keuze; misschien wordt daar in het
      // ontwerpdocument iets over gezegd.
      data: user
    });
  },

  deleteUser: (req, res) => {}
};

module.exports = userController;
