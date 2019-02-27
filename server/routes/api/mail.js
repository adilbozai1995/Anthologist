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
        || !req.body.token
        || !req.body.verify )
        {
            console.log( "verify: missing field" );
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token
        const verkey = req.body.verify

        if ( !isuuid.v4(account) )
        {
            console.log( "verify: invalid account id" );
            return res.sendStatus(400)
        }

        sqlcon.query(
            "SELECT token, verify FROM accounts WHERE id=?;", [ account ],
            function ( err, rsql )
            {
                if ( err )
                {
                    console.log( "verify: sql_error: ", err )
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
                                console.log( "verify: account already verified: " + account )
                                res.json({"status":"fail","reason":"account already verified"})
                            }
                            else if ( rsql[0].verify === verkey )
                            {
                                sqlsec.query( "UPDATE accounts SET verify='verified' WHERE id=?;", [account] );

                                console.log( "verify: verified account with id: " + account )
                                res.json({"status":"okay"})
                            }
                            else
                            {
                                console.log( "verify: invalid verification key" )
                                res.json({"status":"fail","reason":"invalid verification key"})
                            }
                        }
                        else
                        {
                            console.log( "verify: invalid security token" )
                            res.json({"status":"fail","reason":"invalid security token"})
                        }
                    }
                    else
                    {
                        console.log( "verify: no account with id: " + account )
                        res.json({"status":"fail","reason":"no account with that id"})
                    }
                }
            }
        );
    });
}
