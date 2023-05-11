process.env.DB_DATABASE = process.env.DB_DATABASE || 'shareameal-testdb';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
require('tracer').setLevel('error');

chai.should();
chai.use(chaiHttp);

describe('UC-102 Informatie opvragen', function() {
  it('TC-102-1 - Server info should return successful information', (done) => {
    chai
      .request(server)
      .get('/api/info')
      .end((err, res) => {
        res.body.should.be.an('object');
        chai.expect(res.body).to.have.property('status').to.be.equal(201);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body).to.have.property('data');
        let { data, message } = res.body;
        chai.expect(data).to.be.an('object');
        chai.expect(data).to.have.property('studentName').to.be.equal('Davide');
        chai.expect(data).to.have.property('studentNumber').to.be.equal(1234567);
        done();
      });
  });

  it('TC-102-2 - Server should return valid error when endpoint does not exist', (done) => {
    chai
      .request(server)
      .get('/api/doesnotexist')
      .end((err, res) => {
        assert.strictEqual(err, null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        chai.expect(status).to.equal(404);
        chai.expect(message).to.be.a('string').that.is.equal('Endpoint not found');
        chai.expect(data).to.be.an('object');

        done();
      });
  });
});