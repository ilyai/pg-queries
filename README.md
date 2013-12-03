# pg-queries

Neat promise and event based access layer around node-postgres.

## Installation

    npm install pg-queries

## Usage

Immediate query.

```javascript
var pgq = require('pg-queries');

pgq.connect().then(function(connection) {
  connection.query("select version()").then(function(rows) {
    // ....
  });
}):
```

Perform query(-ies) on particular connection.

```javascript
var pgq = require('pg-queries');

pgq.query("select version()").then(function(rows) {
  // ....
});
```

## License
MIT
