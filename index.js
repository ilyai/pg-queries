var pg = require('pg').native;
var Q = require('q');

// configuration
exports.config = {
  database: "postgres",
  host: "/var/run/postgresql/"
};

/**
 * Database connection (from the pool)
 *
 * @param {Client} pg client
 * @param {function} done pg release callback
 */
function Connection(client, done) {
  this._pg = { client: client, done: done };
}

Connection.prototype = {
  /**
   * Perform parameterized query
   *
   * @param {String} sql query text
   * @param {Array} values parameters
   * @return {Promise}
   */
  query: function(sql, values) {
    var deferred = Q.defer(), rows = [];

    var query = this._pg.client.query(sql, values);

    query.on('error', function(error) {
      // log.error(error);
      deferred.reject(error);
    });

    query.on('row', function(row) {
      rows.push(row);
    });

    query.on('end', function(result) {
      deferred.resolve(rows);
    });

    return deferred.promise;
  },

  /**
   * Return client to the pool and void
   * the connection wrapper
   */
  release: function() {
    this._pg.done();
    this._pg.client = null;
    this._pg.done = null;
  },

  /**
   * Whether connection hasn't been released.
   */
  connected: function() {
    return !!this._pg.client;
  }
};

/**
 * Connect to the database
 */
exports.connect = connect;
function connect(config) {
  var self = this,
      deferred = Q.defer();

  pg.connect(config || exports.config, function(error, client, done) {
    if (error) {
      // log.error(error);
      deferred.reject(error);
    } else {
      deferred.resolve(new Connection(client, done));
    }
  });

  return deferred.promise;
}

/**
 * Disconnect all clients within all active pools.
 */
exports.disconnect = disconnect;
function disconnect() {
  pg.end();
}

/**
 * Connect and perform query
 */
exports.query = query;
function query(/* args... */) {
  var args = arguments, deferred = Q.defer();

  connect().then(function(connection) {
    deferred.resolve(connection.query.apply(connection, args));
    connection.release();
  });

  return deferred.promise;
}
