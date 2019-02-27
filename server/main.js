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
//create more accounts, make one read only.
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
    let user_accounts = `create table if not exists accounts(
        id INT NOT NULL AUTO_INCREMENT,
	user_UUID VARCHAR(36) NOT NULL,
        username VARCHAR(32) NOT NULL,	
        password VARCHAR(32) NOT NULL,
        salt VARCHAR(32) NOT NULL,
	email VARCHAR(210) NOT NULL,
        verify tinyint(1) NOT NULL DEFAULT 0,
        flag tinyint(1) NOT NULL DEFAULT 0,
	token_UUID VARCHAR(32) NOT NULL,
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

//Insert into Database
let user_insert = `INSERT INTO accounts(username, password)
    VALUES(?,?)`;

//example method
let sample = ['username', 'password'];

connection.query(user_insert, sample, (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Id:' + results.insertId);
});
