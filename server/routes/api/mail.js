const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/send-verification', function(req, res) {

        if(!req.body
        || !req.body.account
        || !req.body.token )
        {
            console.log( "send-verification: missing field" );
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4(account) )
        {
            console.log( "send-verification: invalid account id" );
            return res.sendStatus(400)
        }

        sqlcon.query(
            "SELECT email, token, verify FROM accounts WHERE id=?;",
            [ account ],
            function( err, rsql )
            {
                if ( err )
                {
                    console.log( "send-verification: sql_error: ", err );
                    res.json({"status":"fail","reason":"un-caught sql error"})
                }
                else
                {
                    if ( rsql.length > 0 )
                    {
                        if ( rsql[0].token === token )
                        {
                            if ( rsql[0].verify === "verified" )
                            {
                                console.log( "send-verification: account already verified: " + account )
                                res.json({"status":"fail","reason":"account already verified"})
                            }
                            else
                            {
                                var verstr = crypto.randomBytes(32).toString('hex')
                                var verurl = "http://localhost:3000/profile/" + account + "?verify=" + verstr

                                mailer.sendMail({
                                    'from': 'anthologist.noreply@gmail.com',
                                    'to': rsql[0].email,
                                    'subject': 'Verify your account',
                                    'text': ( 'Click on this link to verify your account: ' + verurl )
                                }, (err, info) => {
                                    //console.log(info.envelope);
                                    //console.log(info.messageId);
                                });

                                console.log( "send-verification: sent verification email to: " + rsql[0].email )
                                res.json({"status":"okay"})

                                sqlsec.query("UPDATE accounts SET verify=? WHERE id=?;", [verstr, account]);
                            }
                        }
                        else
                        {
                            console.log( "send-verification: invalid security token: " + account )
                            res.json({"status":"fail","reason":"invalid security token"})
                        }
                    }
                    else
                    {
                        console.log( "send-verification: no account with id: " + account )
                        res.json({"status":"fail","reason":"no account with that id"})
                    }
                }
            }
        );
    });

    app.post('/api/verify', function(req, res) {

        if(!req.body
        || !req.body.account
        || !req.body.verify )
        {
            console.log( "verify: missing field" );
            return res.sendStatus(400)
        }

        const account = req.body.account
        const verkey = req.body.verify

        if ( !isuuid.v4(account)
        || token.length != 64
        || verkey.length != 64 )
        {
            console.log( "verify: invalid account id" );
            return res.sendStatus(400)
        }

        sqlcon.query(
            "SELECT verify FROM accounts WHERE id=?;", [ account ],
            function ( err, rsql )
            {
                if ( err )
                {
                    console.log( "verify: sql_error: ", err )
                    res.json({"status":"fail","reason":"un-caught sql error"})
                }
                else if ( rsql.length == 0 )
                {
                    console.log( "verify: no account with id: " + account )
                    res.json({"status":"fail","reason":"no account with that id"})
                }
                else if ( rsql[0].verify === "verified" )
                {
                    console.log( "verify: account already verified: " + account )
                    res.json({"status":"fail","reason":"account already verified"})
                }
                else if ( rsql[0].verify !== verkey )
                {
                    console.log( "verify: invalid verification key" )
                    res.json({"status":"fail","reason":"invalid verification key"})
                }
                else
                {
                    sqlsec.query( "UPDATE accounts SET verify='verified' WHERE id=?;", [account] );

                    console.log( "verify: verified account with id: " + account )
                    res.json({"status":"okay"})
                }
            }
        );
    });

    app.post('/api/send-reset', function(req, res) {

        if(!req.body
        || !req.body.email )
        {
            console.log( 'send-reset: missing field' )
            return res.sendStatus(400)
        }

        const email = req.body.email

        if( email.length > 254 )
        {
            console.log( 'send-reset: field too long' )
            return res.sendStatus(400)
        }

        sqlcon.query("SELECT id FROM accounts WHERE email=?;", [ email ], function( err, rsql )
        {
            if ( err )
            {
                console.log( "send-reset: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"});
            }
            else if ( rsql.length == 0 )
            {
                console.log( "send-reset: no account with email: " + email );
                res.json({"status":"fail","reason":"no account with that email"});
            }
            else
            {
                var reskey = crypto.randomBytes(32).toString('hex');
                var resurl = "http://localhost:3000/reset/" + rsql[0].id + "?reset=" + reskey

                mailer.sendMail({
                    'from': 'anthologist.noreply@gmail.com',
                    'to': email,
                    'subject': 'Reset your password',
                    'text': ( 'Click on this link to reset your account password: ' + resurl )
                }, (err, info) => {
                    //console.log(info.envelope);
                    //console.log(info.messageId);
                });

                sqlsec.query("UPDATE accounts SET reset=? WHERE id=?;", [ reskey, rsql[0].id ] );

                console.log( "send-reset: password reset email sent to: " + email )
                res.json({"status":"okay"})
            }
        });
    });

    app.post('/api/reset', function(req, res) {

        if(!req.body
        || !req.body.account
        || !req.body.reset
        || !req.body.password )
        {
            console.log( 'reset: missing field' )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const reskey = req.body.reset
        const password = req.body.password

        if ( !isuuid.v4(account)
        || reskey.length != 64 )
        {
            console.log( 'reset: invalid field' )
            return res.sendStatus(400)
        }

        const salt = crypto.randomBytes(32);
        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" );
        const token = crypto.randomBytes(32).toString('hex');

        sqlcon.query( "SELECT reset FROM accounts WHERE id=?;", [ account ], function( err, rsql )
        {
            if ( err )
            {
                console.log( "reset: sql_error: ", err )
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( rsql.length == 0 )
            {
                console.log( "reset: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( rsql[0].reset === "no_reset" )
            {
                console.log( "reset: no reset requests pending for account: " + account )
                res.json({"status":"fail","reason":"no resets pending"})
            }
            else if ( rsql[0].reset !== reskey )
            {
                console.log( "reset: incorrect reset key for account: " + account )
                res.json({"status":"fail","reason":"incorrect reset key"})
            }
            else
            {
                sqlsec.query( "UPDATE accounts SET password=?, salt=?, token=?, reset='no_reset' WHERE id=?;",
                    [hashpass.toString('hex'), salt.toString('hex'), token, account] );

                console.log( "reset: password reset for account: " + account )
                res.json({"status":"okay","account":account,"token":token})
            }
        });
    });
}
