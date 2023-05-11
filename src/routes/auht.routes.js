const express = require('express');
const router = express.Router();
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp);

// Importeer de databaseverbinding
const pool = require('src/util/mysql-db.js');

describe('UC-101 [Inloggen]', () => {
  beforeEach((done) => {
    done();
  });

  it('TC-101-1 Succesvol inloggen', (done) => {
    // Basisscenario: gebruiker logt succesvol in met geldige gegevens
    // Voer de teststappen uit
    chai
      .request(server)
      .post('/api/user/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .end((err, res) => {
        assert.ifError(err);
        res.should.have.status(200);
        res.should.be.an('object');

        res.body.should.be.an('object').that.has.all.keys('code', 'message', 'data');
        let { code, message, data } = res.body;
        code.should.be.a('number');
        message.should.be.a('string').that.contains('Login successful');
        data.should.be.an('object');
        // Verifieer de verwachte resultaten, zoals de ontvangen token
        data.should.have.property('token');

        done();
      });
  });

  it('TC-101-2 Inloggen met ontbrekende of ongeldige gegevens', (done) => {
    // Alternatief pad A: ontbrekende of ongeldige gegevens
    // Voer de teststappen uit
    chai
      .request(server)
      .post('/api/user/login')
      .send({
        // Ontbrekende of ongeldige gegevens, zoals ontbrekende e-mail of wachtwoord
      })
      .end((err, res) => {
        assert.ifError(err);
        res.should.have.status(400);
        res.should.be.an('object');

        res.body.should.be.an('object').that.has.all.keys('code', 'message');
        let { code, message } = res.body;
        code.should.be.a('number');
        message.should.be.a('string').that.contains('Error');

        done();
      });
  });

  it('TC-101-3 Inloggen met onjuist wachtwoord', (done) => {
    // Alternatief pad B: onjuist wachtwoord
    // Voer de teststappen uit
    chai
      .request(server)
      .post('/api/user/login')
      .send({
        email: 'test@example.com',
        password: 'incorrectpassword'
      })
      .end((err, res) => {
        assert.ifError(err);
        res.should.have.status(401);
        res.should.be.an('object');

        res.body.should.be.an('object').that.has.all.keys('code', 'message');
        let { code, message } = res.body;
        code.should.be.a('number');
        message.should.be.a('string').that.contains('Invalid credentials');

        done();
      });
  });

  it('TC-101-4 Inloggen met onbekende gebruiker', (done) => {
    chai
      .request(server)
      .post('/api/user/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .end((err, res) => {
        if (err) {
          done(err);
          throw err;
        }

        res.should.have.status(401);
        res.should.be.an('object');

        res.body.should.be.an('object').that.has.all.keys('code', 'message');
        let { code, message } = res.body;
        code.should.be.a('number');
        message.should.be.a('string').that.contains('Invalid password');

        done();
      });
  });
});

module.exports = router;