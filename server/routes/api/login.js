const fetch = require("node-fetch");
const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/signup', function(req, res) {

        if(!req.body
        || !req.body.username
        || !req.body.password
        || !req.body.email )
        {
            console.log( "signup: missing field" );
            return res.sendStatus(400)
        }

        const username = req.body.username
        const password = req.body.password
        const email = req.body.email

        if(username.length > 32
        || password.length > 32
        || email.length > 254 )
        {
            console.log( "signup: field too long" );
            return res.sendStatus(400)
        }

        const acctid = uuid();
        const salt = crypto.randomBytes(32);
        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" );
        const token = crypto.randomBytes(32).toString('hex');

        sqlsec.query(
            'INSERT INTO accounts (id, username, password, salt, email, token) VALUES ( ?, ?, ?, ?, ?, ? )',
            [ acctid, username, hashpass.toString('hex'), salt.toString('hex'), email, token ],
            function( err, rsql ) {
                if ( err ) console.log( "signup: sql_error: " + err )
                console.log( rsql )
            }
        );

        res.json({ "account":acctid, "token":token });
    })

    app.post('/api/login', function(req, res) {

        if(!req.body
        || !req.body.email
        || !req.body.password ) return res.sendStatus(400)

        const email = req.body.email
        const password = req.body.password

        console.log( email + ", " + password )

        const salt = ""
        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" )

        console.log(hashpass.toString("hex"), salt.toString("hex"))
    })
}
