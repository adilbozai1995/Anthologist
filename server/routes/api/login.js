const request = require("request");
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
                if ( err )
                {
                    if ( err.code === 'ER_DUP_ENTRY' )
                    {
                        console.log( "signup: duplicate email" )
                        res.json({"status":"fail","reason":"duplicate email"});
                    }
                    else
                    {
                        console.log( "signup: sql_error: ", err );
                        res.json({"status":"fail","reason":"un-caught sql error"});
                    }
                }
                else
                {
                    console.log( "signup: account created" )
                    res.json({ "status":"okay","account":acctid,"token":token});

                    request.post( "http://localhost:3070/api/verify", {json:{"account":acctid,"token":token}} );
                }
            }
        );
    })

    app.post('/api/login', function(req, res) {

        if(!req.body
        || !req.body.email
        || !req.body.password )
        {
            console.log( 'login: missing field' )
            return res.sendStatus(400)
        }

        const email = req.body.email
        const password = req.body.password

        if(email.length > 254
        || password.length > 32 )
        {
            console.log( 'login: field too long' )
            return res.sendStatus(400)
        }

        sqlcon.query(
            'SELECT id, password, salt FROM accounts WHERE email=?;',
            [ email ],
            function ( err, rsql )
            {
                if ( err )
                {
                    console.log( "login: sql_error: ", err );
                    res.json({"status":"fail","reason":"un-caught sql error"});
                }

                if ( rsql.length > 0 )
                {
                    var acct = rsql[0];

                    const salt = Buffer.from( acct.salt, 'hex' )
                    const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" )

                    if ( hashpass.toString('hex') === acct.password )
                    {
                        const token = crypto.randomBytes(32).toString('hex');

                        sqlsec.query( 'UPDATE accounts SET token=? WHERE id=?;', [ token, acct.id ] );

                        console.log( "login: correct password for email: " + email );
                        res.json({"status":"okay","account":acct.id,"token":token})
                    }
                    else
                    {
                        console.log( "login: incorrect password for email: " + email );
                        res.json({"status":"fail","reason":"incorrect password"})
                    }
                }
                else
                {
                    console.log( "login: no account with email: " + email );
                    res.json({"status":"fail","reason":"no account with that email"})
                }
            }
        );
    });

    app.post('/api/validate', function(req, res) {

        if(!req.body
        || !req.body.account
        || !req.body.token )
        {
            console.log( 'validate: missing field' )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if(!isuuid.v4( account )
        || token.length != 64 )
        {
            console.log( 'validate: incorrect field' )
            return res.sendStatus(400)
        }

        sqlcon.query(
            "SELECT token FROM accounts WHERE id=?;",
            [ account ],
            function( err, rsql )
            {
                if ( err )
                {
                    console.log( "validate: sql_error: ", err );
                    res.json({"status":"fail","reason":"un-caught sql exception"});
                }
                else if ( rsql.length == 0 )
                {
                    console.log( "validate: no account with id: " + account );
                    res.json({"status":"fail","reason":"no account with that id"});
                }
                else if ( rsql[0].token !== token )
                {
                    console.log( "validate: invalid login token for id: " + account );
                    res.json({"status":"fail","reason":"invalid login token"});
                }
                else
                {
                    console.log( "validate: valid login token for id: " + account );
                    res.json({"status":"okay"})
                }
            }
        );
    });
}
