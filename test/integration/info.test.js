const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
require('tracer').setLevel('error');

const expect = chai.expect;

chai.use(chaiHttp);

describe('UC-102 Informatie opvragen', function() {
  describe('GET /api/info', function() {
    it('should return successful information', (done) => {
      chai
        .request(server)
        .get('/api/info')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('data').that.is.an('object');
          expect(res.body.data).to.have.property('studentName').that.is.equal('Davide');
          expect(res.body.data).to.have.property('studentNumber').that.is.equal(1234567);
          done();
        });
    });
  });

  describe('Invalid endpoint', function() {
    it('should return 404 error when endpoint does not exist', (done) => {
      chai
        .request(server)
        .get('/api/doesnotexist')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.is.a('string').that.is.equal('Endpoint not found');
          expect(res.body).to.have.property('data').that.is.an('object');
          done();
        });
    });
  });
});