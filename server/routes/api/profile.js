const request = require("request");
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/fetch-profile', function(req, res) {

        if(!req.body
        || !req.body.account )
        {
            console.log( "fetch-profile: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account

        if ( ! isuuid.v4( account ) )
        {
            console.log( "fetch-profile: invalid account: " + account )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT username, description, flag FROM accounts WHERE id=?;", [ account ],
            function (err, rsql)
            {
                if ( err )
                {
                    console.log( "fetch-profile: sql_error: ", err )
                    res.json({"status":"fail","reason":"un-caught sql error"});
                }
                else if ( rsql.length == 0 )
                {
                    console.log( "fetch-profile: no account with id: " + account );
                    res.json({"status":"fail","reason":"no account with that id"});
                }
                else
                {
                    res.json({
                        "status":"okay",
                        "username": rsql[0].username,
                        "description": rsql[0].description,
                        "flag": rsql[0].flag,
                        "verify": rsql[0].verify
                    });
                }
            }
        );
    });

    app.post('/api/flag-profile', function(req, res) {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.flag) // The account being flagged
        {
            console.log("flag-profile: missing field")
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token
        const flag = req.body.flag

        if(!isuuid.v4( account )
        || !isuuid.v4( flag )
        || token.length != 64 )
        {
            console.log("flag-profile: invalid field")
            return res.sendStatus(400)
        }

        request.post( "http://localhost:3070/api/validate", {json:{"account":account,"token":token}}, function(verr, vres, body)
        {
            if ( verr )
            {
                console.log( "flag-profile: validate request error: ", verr )
                res.json({"status":"fail","reason":"unable to authenticate"})
            }
            else
            {
                var vresb = JSON.parse( body )

                else if ( vresp.status === "fail" )
                {
                    console.log( "flag-profile: invalid authentication token for account: " + account )
                    res.json({"status":"fail","reason":"invalid authentication token"})
                }
                else
                {
                    sqlsec.query("UPDATE accounts SET flag=? WHERE id=? AND id='no_flag';", [ account, flag ], function( err, rsql )
                    {
                        if ( err )
                        {
                            console.log( "flag-profile: sql_error: ", err )
                            res.json({"status":"fail","reason":"un-caught sql error"})
                        }
                        else if ( rsql.affectedRows < 1 )
                        {
                            console.log("flag-profile: account already flagged or doesn't exist: (FLAG:" + flag + "|ACCT:" + account + ")" )
                            res.json({"status":"fail","reason":"account already flaged or doesn't exist"})
                        }
                        else
                        {
                            console.log("flag-profile: account: " + flag + " flagged by: " + account)
                            res.json({"status":"okay"})
                        }
                    });
                }
            }
        });
    });
}
