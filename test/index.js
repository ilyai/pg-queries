var assert = require('assert');
var pgq = require('./..');
var sinon = require('sinon');

describe(".connection", function() {
  before(function(done) {
    var self = this;
    pgq.connect().then(function(connection) {
      self.connection = connection;
      done();
    });
  });

  it("should be established", function() {
    assert.ok(this.connection.connected());
  });

  describe(".query()", function() {
    it("should do simple query", function(done) {
      var onQuery = sinon.spy();
      pgq.once('query', onQuery);
      this.connection.query("select version()").then(function(rows) {
        assert.ok(/postgres/i.test(rows[0].version));
        assert.ok(onQuery.calledOnce);
        done();
      }).fail(function(err) {
        assert.ifError(err);
        done();
      });
    });

    it("should do parameterized query", function(done) {
      var sql = "select * from (select cast('foo' as text) a) t where a = $1";
      this.connection.query(sql, ["foo"]).then(function(rows) {
        assert.equal(rows[0].a, "foo");
        done();
      }).fail(function(err) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe(".release()", function() {
    it("should release the connection", function() {
      this.connection.release();
      assert.ok(!this.connection.connected());
    });
  });
});

describe(".query()", function() {
  it("should do instant query", function(done) {
    var onQuery = sinon.spy();
    pgq.once('query', onQuery);
    pgq.query("select version()").then(function(rows) {
      assert.ok(/postgres/i.test(rows[0].version));
      assert.ok(onQuery.calledOnce);
      done();
    }).fail(function(err) {
      assert.ifError(err);
      done();
    });
  });
});

describe(".disconnect()", function() {
  it("should do disconnection", function() {
    pgq.disconnect();
  });
});
