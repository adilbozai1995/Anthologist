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
        
    });
}
