const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
require('tracer').setLevel('error');

chai.should();
chai.use(chaiHttp);

describe('UC-201 Registreren als nieuwe user', () => {
  it('TC-201-1 - Verplicht veld ontbreekt', (done) => {
    done();
  });

  it('TC-201-2 - User succesvol geregistreerd', (done) => {
    const newUser = {
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAddress: 'hvd@server.nl'
    };

    chai
      .request(server)
      .post('/api/register')
      .send(newUser)
      .end((err, res) => {
        assert(err === null);
        chai.expect(err).to.be.null;

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').that.contains('toegevoegd');
        data.should.be.an('object');

        data.should.include({ id: 2 });
        data.should.not.include({ id: 0 });
        data.id.should.equal(2);
        data.firstName.should.equal('Hendrik');

        done();
      });
  });
});

describe('UC-202 Opvragen van overzicht van users', () => {
  it('TC-202-1 - Toon alle gebruikers, minimaal 2', (done) => {
    chai
      .request(server)
      .get('/api/user')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getAll endpoint');

        data.should.be.an('array').that.has.length(3);

        done();
      });
  });

  it.skip('TC-202-2 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
    chai
      .request(server)
      .get('/api/user')
      .query({ name: 'foo', city: 'non-existent' })
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getAll endpoint');
        data.should.be.an('array');

        done();
      });
  });
});
describe('UC-203 Haal het userprofile op van de user die ingelogd is', () => {
  it('TC-203-1 - Userprofile ophalen van ingelogde gebruiker', (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .set('Authorization', 'Bearer <jwt-token>')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('Get User profile');
        data.should.be.an('object');

        // Voeg hier je assertions toe voor de inhoud van het userprofile

        done();
      });
  });
});

describe('UC-204 Een gebruiker ophalen aan de hand van een ID', () => {
  it('TC-204-1 - Bestaande gebruiker ophalen', (done) => {
    const userId = 1;

    chai
      .request(server)
      .get(`/api/users/${userId}`)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getById endpoint');
        data.should.be.an('object');

        // Voeg hier je assertions toe voor de inhoud van de gebruiker

        done();
      });
  });
});
describe('UC-205 Een gebruiker bijwerken', () => {
  it('TC-205-1 - Bestaande gebruiker bijwerken', (done) => {
    const userId = 1;
    const updatedUserData = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'johndoe@example.com'
    };

    chai
      .request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUserData)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User update endpoint');
        data.should.be.an('object');

        // Voeg hier je assertions toe om te controleren of de gebruiker is bijgewerkt

        done();
      });
  });

  it('TC-205-2 - Niet-bestaande gebruiker bijwerken', (done) => {
    const userId = 999;
    const updatedUserData = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'johndoe@example.com'
    };

    chai
      .request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUserData)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { message, status } = res.body;

        status.should.equal(404);
        message.should.be.a('string').equal('User not found');

        done();
      });
  });
});

describe('UC-206 Een gebruiker verwijderen', () => {
  it('TC-206-1 - Bestaande gebruiker verwijderen', (done) => {
    const userId = 1;

    chai
      .request(server)
      .delete(`/api/users/${userId}`)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User delete endpoint');

        done();
      });
  });

  it('TC-206-2 - Niet-bestaande gebruiker verwijderen', (done) => {
    const userId = 999;

    chai
      .request(server)
      .delete(`/api/users/${userId}`)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { message, status } = res.body;

        status.should.equal(404);
        message.should.be.a('string').equal('User not found');

        done();
      });
  });
});
