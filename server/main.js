const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const port = 3070

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    res.send("Anthologist backend!");
});

// Connect to the database as the insecure bot
var db1 = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'service',
    password: 'Anthologist',
    database: 'Anthologist'
});

db1.connect(function(err) {
    if (err) {
        return console.error('MySQL error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});
global.sqlcon = db1;

// Connect to the database as the secure bot
var db2 = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'serviceSecure',
    password: 'Anthologist',
    database: 'Anthologist'
});

db2.connect(function(err) {
    if (err) {
        return console.error('MySQL error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});
global.sqlcon = db2;

app.listen(port, (err) => {
    if ( err ) { console.log( err ); };
    console.log(`Anthologist backend server listening on port ${port}!`);
});
