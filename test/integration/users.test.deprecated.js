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