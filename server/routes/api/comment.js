const request = require("request")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/comment-create', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.profile
        || typeof( req.body.text ) === 'undefined' )
        {
            console.log( "comment-create: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "comment-create: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "comment-create: invalid token" )
            return res.sendStatus(400)
        }

        const profile = req.body.profile

        if ( !isuuid.v4( profile ) )
        {
            console.log( "comment-create: invalid profile: " + profile )
            return res.sendStatus(400)
        }

        if ( profile === account )
        {
            console.log( "comment-create: cannot leave comment on own profile: " + account )
            return res.sendStatus(400)
        }

        const text = req.body.text

        if ( text.length <= 0 )
        {
            console.log( "comment-create: no block content" )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "comment-create: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "comment-create: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("comment-create: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                const comment = uuid();
                const rightnow = Date.now() / 1000;

                sqlsec.query( "INSERT INTO comments (id, content, author, userprof, born) VALUES (?, ?, ?, ?, ?);",
                [
                    comment,
                    text,
                    account,
                    profile,
                    rightnow
                ]);

                console.log( "comment-create: account: " + account + ", posted a comment to: " + profile )
                res.json({"status":"okay"})
            }
        });
    });
}
