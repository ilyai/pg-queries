# pg-queries

Neat promise and event based access layer around node-postgres.

## Installation

    npm install pg-queries

## Usage

Perform query(-ies) on particular connection.

```javascript
var pgq = require('pg-queries');

pgq.connect().then(function(connection) {
  connection.query("select version()").then(function(rows) {
    // ....
  });
});
```

Immediate query.

```javascript
var pgq = require('pg-queries');

pgq.query("select version()").then(function(rows) {
  // ....
});
```

## License
MIT
