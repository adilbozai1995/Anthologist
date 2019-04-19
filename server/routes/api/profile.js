const request = require("request")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/fetch-profile', function(req, res)
    {
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

        sqlcon.query( "SELECT * FROM accounts WHERE id=?;", [ account ],
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
                    sqlcon.query( "SELECT blocks.*, accounts.username FROM blocks INNER JOIN accounts ON blocks.author=accounts.id WHERE author=?;", [ account ],
                    function( err, brsql )
                    {
                        if ( err )
                        {
                            console.log( "fetch-profile: sql_error: ", err )
                            res.json({"status":"fail","reason":"un-caught sql error"});
                        }
                        else
                        {
                            sqlcon.query( "SELECT stories.*, accounts.username FROM stories INNER JOIN accounts ON stories.author=accounts.id WHERE author=? ORDER BY stories.born DESC;", [ account ],
                            function( err, srsql )
                            {
                                if ( err )
                                {
                                    console.log( "fetch-profile: sql_error: ", err )
                                    res.json({"status":"fail","reason":"un-caught sql error"});
                                }
                                else
                                {
                                    sqlcon.query( "SELECT comments.*, accounts.username FROM comments INNER JOIN accounts.username ON comments.author=accounts.id WHERE userprof=?;", [ account ],
                                    function( err, crsql )
                                    {
                                        if ( err )
                                        {
                                            console.log( "fetch-profile: sql_error: ", err )
                                            res.json({"status":"fail","reason":"un-caught sql error"});
                                        }
                                        else
                                        {
                                            var blocks = []
                                            var stories = []
                                            var comments = []

                                            for ( var i = 0; i < brsql.length; i++ )
                                            {
                                                var flag = 0;
                                                if ( brsql[i].flag != "no_flag" ) flag = 1;

                                                blocks.push({
                                                    "id":brsql[i].id,
                                                    "content":brsql[i].content,
                                                    "story":brsql[i].story,
                                                    "author":brsql[i].author,
                                                    "username":brsql[i].username,
                                                    "rating":brsql[i].rating,
                                                    "ending":brsql[i].ending,
                                                });
                                            }

                                            for ( var i = 0; i < srsql.length; i++ )
                                            {
                                                stories.push({
                                                    "id":srsql[i].id,
                                                    "author":srsql[i].author,
                                                    "username":srsql[i].username,
                                                    "title":srsql[i].title,
                                                    "views":srsql[i].views
                                                });
                                            }

                                            for ( var i = 0; i < crsql.length; i++ )
                                            {
                                                comments.push({
                                                    "id":crsql[i].id,
                                                    "author":crsql[i].author,
                                                    "username":crsql[i].username,
                                                    "content":crsql[i].content
                                                });
                                            }

                                            var flag = 0;
                                            if ( rsql[0].flag != 'no_flag' ) flag = 1;

                                            res.json({
                                                "status":"okay",
                                                "username": rsql[0].username,
                                                "description": rsql[0].description,
                                                "flag": flag,
                                                "verify": rsql[0].verify,
                                                "admin": rsql[0].admin,
                                                "image": rsql[0].image,
                                                "blocks": blocks,
                                                "stories": stories,
                                                "comments": comments
                                            });
                                        }
                                    });
                                }
                            });
                        }
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
                if ( String(body).indexOf("'fail'") > 0 )
                {
                    console.log( "flag-profile: invalid authentication token for account: " + account )
                    res.json({"status":"fail","reason":"invalid authentication token"})
                }
                else
                {
                    sqlsec.query("UPDATE accounts SET flag=? WHERE id=? AND flag='no_flag';", [ account, flag ], function( err, rsql )
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

    app.post('/api/profile-remove', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.profile)
        {
            console.log("profile-remove: missing field")
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token
        const profile = req.body.profile

        if(!isuuid.v4( account )
        || !isuuid.v4( profile )
        || token.length != 64 )
        {
            console.log("profile-remove: invalid field")
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token, admin FROM accounts WHERE id=?;",
        [ account ],
        function ( err, rsql )
        {
            if ( err )
            {
                console.log( "profile-remove: sql_error: ", err )
                res.json({"status":"fail","reason":"un-caught sql error"});
            }
            else if ( rsql.length == 0 )
            {
                console.log( "profile-remove: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"});
            }
            else if ( rsql[0].token !== token )
            {
                console.log( "profile-remove: invalid token for account: " + account )
                res.json({"status":"fail","reason":"invalid token"});
            }
            else if ( rsql[0].admin != 1 )
            {
                console.log( "profile-remove: not an admin account: " + account );
                res.json({"status":"fail","reason":"not admin"});
            }
            else
            {
                sqlsec.query("DELETE FROM accounts WHERE id=?;", [ profile ])
                sqlsec.query("DELETE FROM story_bookmark WHERE user=?;", [ profile ])
                sqlsec.query("DELETE FROM story_writers WHERE writer=?;", [ profile ])

                console.log( "profile-remove: admin: " + account + ", deleted account: " + profile )
                res.json({"status":"okay"})
            }
        });
    });

    app.post('/api/profile-description', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || typeof( req.body.text ) === 'undefined' )
        {
            console.log( "profile-description: missing field" )
            return res.sendStatus(400)
        }

        const account = req.body.account

        if ( !isuuid.v4( account ) )
        {
            console.log( "profile-description: invalid account: " + account )
            return res.sendStatus(400)
        }

        const token = req.body.token

        if ( token.length != 64 )
        {
            console.log( "profile-description: invalid token" )
            return res.sendStatus(400)
        }

        const text = req.body.token

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "profile-description: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "profile-description: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("profile-description: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlcon.query( "UPDATE accounts SET description=? WHERE id=?;", [text, account], function( a, b ) {} )

                console.log( "profile-description: updated description for account: " + account )
                res.json({"status":"okay"})
            }
        });
    });

    app.post('/api/profile-image', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.image )
        {
            console.log( "profile-image: missing field" )
            return res.sendStatus(400)
        }

        const account = req.body.account

        if ( !isuuid.v4( account ) )
        {
            console.log( "profile-image: invalid account: " + account )
            return res.sendStatus(400)
        }

        const token = req.body.token

        if ( token.length != 64 )
        {
            console.log( "profile-image: invalid token" )
            return res.sendStatus(400)
        }

        const image = req.body.image

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "profile-image: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "profile-image: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("profile-image: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlcon.query( "UPDATE accounts SET image=? WHERE id=?;", [image, account], function( a, b ) {} )

                console.log( "profile-image: updated image for account: " + account )
                res.json({"status":"okay"})
            }
        });
    });
}
