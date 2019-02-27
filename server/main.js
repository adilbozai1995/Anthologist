const express = require('express')
const bodyParser = require('body-parser')
const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")
const app = express()
const port = 3070

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    res.send("Anthologist backend!")
})

app.listen(port, () => console.log(`Anthologist backend server listening on port ${port}!`))

//MySQL Stuff here
//Connect to server and Database
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'samuel',
    password: 'Anthologist',
    database: 'Anthologist'
});

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');


    //Create User Account Table
    //set varchar to max length, and so on
    let user_accounts = `create table accounts(
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,	
        password VARCHAR(100) NOT NULL,
        PRIMARY KEY ( id )
    )`;

    connection.query(user_accounts, function(err, results, fields){
        if (err) {
            console.log(err.message);
        }
    });

    connection.end(function(err) {
        if (err) {
        return console.log(err.message);
        }
    });

});
