process.env.DB_DATABASE = process.env.DB_DATABASE || 'shareameal-testdb';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const assert = require('assert');
const dbconnection = require('../../src/util/mysql-db');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/util/utils');
require('tracer').setLevel('trace');

chai.should();
chai.use(chaiHttp);

// Clear and fill the test database before each test
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

// Add a user to the database
const INSERT_USER =
  'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
  '(1, "first", "last", "name@server.nl", "secret", "street", "city");';

// Add two meals to the database
const INSERT_MEALS =
  'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
  '(1, \'Meal A\', \'description\', \'image url\', NOW(), 5, 6.50, 1),' +
  '(2, \'Meal B\', \'description\', \'image url\', NOW(), 5, 6.50, 1);';

describe('Users API', () => {
  before((done) => {
    // Perform setup tasks before running the tests
    logger.trace('before: perform preconditions setup here');
    logger.trace('before done');
    done();
  });

  describe('UC-xyz [use case description]', () => {
    beforeEach((done) => {
      // Clear the test database and add a user before each test
      logger.trace('beforeEach called');
      dbconnection.getConnection(function(err, connection) {
        if (err) {
          done(err);
          throw err; // no connection
        }
        connection.query(CLEAR_DB + INSERT_USER, function(error, results, fields) {
          if (error) {
            done(error);
            throw error; // not connected!
          }
          logger.trace('beforeEach done');
          dbconnection.releaseConnection(connection);
          done();
        });
      });
    });

    it.skip('TC-201-1 Voorbeeld testcase, met POST, wordt nu geskipped', (done) => {
      chai
        .request(server)
        .post('/api/movie')
        .send({
          // name is missing
          year: 1234,
          studio: 'pixar'
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(401);
          res.should.be.an('object');

          res.body.should.be.an('object').that.has.all.keys('code', 'message');
          code.should.be.an('number');
          message.should.be.a('string').that.contains('error');
          done();
        });
    });

    it('TC-201-2 Als gebruiker wil ik mezelf kunnen registreren in het systeem', (done) => {
      // Basisscenario
      chai
        .request(server)
        .post('/api/user/register')
        .send({
          // Provide the necessary user registration data
          email: 'test@example.com',
          password: 'test123',
          firstName: 'John',
          lastName: 'Doe'
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(200);
          res.should.be.an('object');

          res.body.should.be.an('object').that.has.all.keys('code', 'message', 'data');
          let { code, message, data } = res.body;
          code.should.be.a('number');
          message.should.be.a('string').that.contains('User registration');
          data.should.be.an('object');
          // Add additional validations as needed
          done();
        });
    });

// En hier komen meer testcases
  });

  describe('UC-203 Opvragen van gebruikersprofiel', () => {
    beforeEach((done) => {
      logger.trace('beforeEach called');
      // Clear the test database before running the tests
      dbconnection.getConnection(function(err, connection) {
        if (err) {
          done(err);
          throw err;
        }
        connection.query(CLEAR_DB + INSERT_USER, function(error, results, fields) {
          if (error) {
            done(error);
            throw error;
          }
          logger.trace('beforeEach done');
          dbconnection.releaseConnection(connection);
          done();
        });
      });
    });

    it.skip('TC-203-1 Invalid token', (done) => {
      chai
        .request(server)
        .get('/api/user/profile')
        .set('authorization', 'Bearer hier-staat-een-ongeldig-token')
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(401);
          res.should.be.an('object');

          res.body.should.be
            .an('object')
            .that.has.all.keys('code', 'message', 'data');
          let { code, message, data } = res.body;
          code.should.be.an('number');
          message.should.be.a('string').equal('Not authorized');
          done();
        });
    });

    it('TC-203-2 User logged in with valid token', (done) => {
      chai
        .request(server)
        .get('/api/user/profile')
        .set('authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(200);
          res.should.be.an('object');

          res.body.should.be
            .an('object')
            .that.has.all.keys('code', 'message', 'data');
          let { code, message, data } = res.body;
          code.should.be.an('number');
          message.should.be.a('string').that.contains('Get User profile');
          data.should.be.an('object');
          data.id.should.equal(1);
          data.firstName.should.equal('first');
          // Additional validations
          data.lastName.should.equal('last');
          data.emailAddress.should.equal('name@server.nl');
          data.street.should.equal('street');
          data.city.should.equal('city');
          done();
        });
    });


    describe('UC-303 Lijst van maaltijden opvragen', () => {
      //
      beforeEach((done) => {
        logger.debug('beforeEach called');
        dbconnection.getConnection(function(err, connection) {
          if (err) {
            done(err);
            throw err; // not connected!
          }
          connection.query(
            CLEAR_DB + INSERT_USER + INSERT_MEALS,
            function(error, results, fields) {
              // When done with the connection, release it.
              dbconnection.releaseConnection(connection);
              // Handle error after the release.
              if (err) {
                done(err);
                throw err;
              }
              // Let op dat je done() pas aanroept als de query callback eindigt!
              logger.debug('beforeEach done');
              done();
            }
          );
        });
      });

      it.skip('TC-303-1 Lijst van maaltijden wordt succesvol geretourneerd', (done) => {
        chai
          .request(server)
          .get('/api/meal')
          // wanneer je authenticatie gebruikt kun je hier een token meesturen
          // .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
          .end((err, res) => {
            assert.ifError(err);

            res.should.have.status(200);
            res.should.be.an('object');

            res.body.should.be
              .an('object')
              .that.has.all.keys('message', 'data', 'code');

            const { code, data } = res.body;
            code.should.be.an('number');
            data.should.be.an('array').that.has.length(2);
            data[0].name.should.equal('Meal A');
            data[0].id.should.equal(1);
            done();
          });
      });
    });
  });
});