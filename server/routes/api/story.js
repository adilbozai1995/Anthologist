const request = require("request")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/story-create', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.title
        || !req.body.charlimit // Character limit per block
        || !req.body.minblock  // Min blocks before voting starts
        || !req.body.votetime  // How long to keep voting open for (minutes)
        || !req.body.storylen  // Min number of blocks before story can end
        || typeof(req.body.writers) === 'undefined' // CSV of writers
        || typeof(req.body.block  ) === 'undefined' ) // Text of the first block
        {
            console.log( "story-create: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "story-create: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "story-create: invalid token" )
            return res.sendStatus(400)
        }


        const title = req.body.title

        if ( title.length > 300 )
        {
            console.log( "story-create: title too long" )
            return res.sendStatus(400)
        }

        const storylen = parseInt(req.body.storylen, 10)
        const charlimit = parseInt(req.body.charlimit, 10)
        const minblock = parseInt(req.body.minblock, 10)
        const votetime = parseInt(req.body.votetime, 10)

        if ( isNaN( storylen )
        ||   isNaN( charlimit )
        ||   isNaN( minblock )
        ||   isNaN( votetime ) )
        {
            console.log( "story-create: invalid field" )
            return res.sendStatus(400)
        }

        if ( charlimit > 65536 || charlimit < 0 )
        {
            console.log( "story-create: charlimit too long or short: " + charlimit )
            return res.sendStatus(400)
        }

        if ( votetime > 1440 || votetime < 1 )
        {
            console.log( "story-create: vote time too long or short: " + votetime )
            return res.sendStatus(400)
        }

        const blocktext = req.body.block

        if ( blocktext.length > charlimit || blocktext.length <= 0 )
        {
            console.log( "story-create: starting block violates character limit" )
            return res.sendStatus(400)
        }

        var writers = req.body.writers.split(",")

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;",
        [ account ],
        function( aerr, arsql )
        {
            if ( aerr )
            {
                console.log( "story-create: sql_error: ", aerr );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length == 0 )
            {
                console.log( "story-create: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("story-create: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                const storyid = uuid( )
                const rightnow = Date.now() / 1000;

                sqlsec.query( "INSERT INTO stories (id, author, title, charlimit, minblock, votetime, storylen, born) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
                [
                    storyid,
                    account,
                    title,
                    charlimit,
                    minblock,
                    votetime,
                    storylen,
                    rightnow,
                ]);

                for ( var i = 0; i < writers.length; i++ )
                {
                    if ( isuuid.v4( writers[i] ) )
                    {
                        sqlsec.query( "INSERT INTO story_writers (writer, story) VALUES (?, ?);",
                        [
                            writers[i],
                            storyid
                        ], function(ca,cb){});
                    }
                }

                const blockid = uuid()

                sqlsec.query( "INSERT INTO blocks (id, content, story, iteration, author, ending, born) VALUES (?, ?, ?, ?, ?, ?, ?);",
                [
                    blockid,
                    blocktext,
                    storyid,
                    0,
                    account,
                    0,
                    rightnow
                ]);

                console.log("story-create: created new story: " + title );
                res.json({"status":"okay","story":storyid});
            }
        });
    });

    app.post('/api/story-editvote', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.story
        || !req.body.votetime)
        {
            console.log( "story-editvote: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "story-editvote: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "story-editvote: invalid token" )
            return res.sendStatus(400)
        }

        const story = req.body.story

        if ( !isuuid.v4( story ) )
        {
            console.log( "story-editvote: invalid story: " + story )
            return res.sendStatus(400)
        }

        const votetime = parseInt( req.body.votetime, 10 )

        if ( isNaN( votetime ) )
        {
            console.log( "story-editvote: votetime is not a number" )
            return res.sendStatus(400)
        }

        if ( votetime > 1440 || votetime < 1 )
        {
            console.log( "story-editvote: vote time too long or short: " + votetime )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;",
        [ account ],
        function( aerr, arsql )
        {
            if ( aerr )
            {
                console.log( "story-editvote: sql_error: ", aerr );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length == 0 )
            {
                console.log( "story-editvote: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("story-editvote: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlsec.query("UPDATE stories SET votetime=? WHERE votemode=0 AND id=?;",
                [
                    votetime,
                    story
                ],function(ca,cb){});

                console.log("story-editvote: updated edit time on story: " + story + ", time is: " + votetime + " minutes" );
                res.json({"status":"okay"});
            }
        });
    });

    app.post('/api/story-fetch', function(req, res)
    {
        if ( !req.body || !req.body.story )
        {
            console.log( "story-fetch: missing fields" )
            return res.sendStatus(400)
        }

        const story = req.body.story

        if ( !isuuid.v4( story ) )
        {
            console.log( "story-fetch: invalid story: " + story )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT * FROM stories WHERE id=?",
        [ story ],
        function( err, rsql )
        {
            if ( err )
            {
                console.log( "story-fetch: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( rsql.length == 0 )
            {
                console.log( "story-fetch: no storry with id: " + story )
                res.json({"status":"fail","reason":"no story with that id"})
            }
            else
            {
                sqlsec.query( "UPDATE stories SET views = views + 1 WHERE id=?", [ story ], function(ca,cb){} )

                sqlcon.query( "SELECT blocks.*, accounts.username FROM blocks INNER JOIN accounts ON blocks.author = accounts.id WHERE blocks.story=? ORDER BY blocks.iteration ASC;", [ story ], function( err, brsql )
                {
                    if ( err )
                    {
                        console.log( "story-fetch: sql_error: ", err );
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else
                    {
                        var out = []
                        var storyRating = 0;

                        for ( var i = 0; i < brsql.length; i++ )
                        {
                            var flag = 0;
                            if ( brsql[i].flag !== "no_flag" ) flag = 1;

                            out.push({
                                "id":brsql[i].id,
                                "content":brsql[i].content,
                                //"story":brsql[i].story,
                                "iteration":brsql[i].iteration,
                                "author":brsql[i].author,
                                "username":brsql[i].username,
                                "rating":brsql[i].rating,
                                "ending":brsql[i].ending,
                                "flag":flag
                            });

                            if ( brsql[i].iteration < rsql[0].iteration )
                            {
                                storyRating += brsql[i].rating
                            }
                        }

                        console.log( "story-fetch: fetched story with id: " + story )
                        res.json({
                            "status":"okay",
                            "author":rsql[0].author,
                            "title":rsql[0].title,
                            "flag":rsql[0].flag,
                            "charlimit":rsql[0].charlimit,
                            "minblock":rsql[0].minblock,
                            "votetime":rsql[0].votetime,
                            "storylen":rsql[0].storylen,
                            "views":(rsql[0].views + 1),
                            "votestart":rsql[0].votestart,
                            "votemode":rsql[0].votemode,
                            "iteration":rsql[0].iteration,
                            "ended":rsql[0].ended,
                            "rating":storyRating,
                            "blocks":out
                        });
                    }
                });
            }
        });
    });

    app.post('/api/story-bookmark', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.story)
        {
            console.log( "story-bookmark: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "story-bookmark: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "story-bookmark: invalid token" )
            return res.sendStatus(400)
        }

        const story = req.body.story

        if ( !isuuid.v4( story ) )
        {
            console.log( "story-bookmark: invalid story: " + story )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;",
        [ account ],
        function( aerr, arsql )
        {
            if ( aerr )
            {
                console.log( "story-bookmark: sql_error: ", aerr );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length == 0 )
            {
                console.log( "story-bookmark: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("story-bookmark: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlsec.query("INSERT INTO story_bookmark (user, story) VALUES (?, ?);",
                [
                    account,
                    story
                ], function(ca,cb){});

                console.log("story-bookmarke: bookmarked story: " + story + ", for user: " + account );
                res.json({"status":"okay"});
            }
        });
    });

    app.post('/api/story-remove', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.story)
        {
            console.log("story-remove: missing field")
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token
        const story = req.body.story

        if(!isuuid.v4( account )
        || !isuuid.v4( story )
        || token.length != 64 )
        {
            console.log("story-remove: invalid field")
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token, admin FROM accounts WHERE id=?;",
        [ account ],
        function ( err, rsql )
        {
            if ( err )
            {
                console.log( "story-remove: sql_error: ", err )
                res.json({"status":"fail","reason":"un-caught sql error"});
            }
            else if ( rsql.length == 0 )
            {
                console.log( "story-remove: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"});
            }
            else if ( rsql[0].token !== token )
            {
                console.log( "story-remove: invalid token for account: " + account )
                res.json({"status":"fail","reason":"invalid token"});
            }
            else if ( rsql[0].admin != 1 )
            {
                console.log( "story-remove: not an admin account: " + account );
                res.json({"status":"fail","reason":"not admin"});
            }
            else
            {
                sqlsec.query("DELETE FROM stories WHERE id=?;", [ story ])
                sqlsec.query("DELETE FROM story_bookmark WHERE story=?;", [ story ])
                sqlsec.query("DELETE FROM story_writers WHERE story=?;", [ story ])
                sqlsec.query("DELETE FROM blocks WHERE story=?;", [ story ])

                console.log( "story-remove: admin: " + account + ", deleted story: " + story )
                res.json({"status":"okay"})
            }
        });
    });

    app.post('/api/story-flag', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.flag) // The story being flagged
        {
            console.log("story-flag: missing field")
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token
        const flag = req.body.flag

        if(!isuuid.v4( account )
        || !isuuid.v4( flag )
        || token.length != 64 )
        {
            console.log("story-flag: invalid field")
            return res.sendStatus(400)
        }

        request.post( "http://localhost:3070/api/validate", {json:{"account":account,"token":token}}, function(verr, vres, body)
        {
            if ( verr )
            {
                console.log( "story-flag: validate request error: ", verr )
                res.json({"status":"fail","reason":"unable to authenticate"})
            }
            else if ( String(body).indexOf("'fail'") > 0 )
            {
                console.log( "story-flag: invalid authentication token for account: " + account )
                res.json({"status":"fail","reason":"invalid authentication token"})
            }
            else
            {
                sqlsec.query("UPDATE stories SET flag=? WHERE id=? AND flag='no_flag';", [ account, flag ], function( err, rsql )
                {
                    if ( err )
                    {
                        console.log( "story-flag: sql_error: ", err )
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( rsql.affectedRows < 1 )
                    {
                        console.log("story-flag: story already flagged or doesn't exist: (FLAG:" + flag + "|ACCT:" + account + ")" )
                        res.json({"status":"fail","reason":"story already flaged or doesn't exist"})
                    }
                    else
                    {
                        console.log("story-flag: story: " + flag + " flagged by: " + account)
                        res.json({"status":"okay"})
                    }
                });
            }
        });
    });

    app.post('/api/story-homepage', function(req, res)
    {
        if ( !req.body || typeof( req.body.mode ) === 'undefined' )
        {
            console.log("story-homepage: missing field")
            return res.sendStatus(400)
        }

        var mode = req.body.mode

        if ( isNaN( mode ) || mode < 0 || mode > 2 )
        {
            console.log("story-homepage: invalid mode: " + mode)
            return res.sendStatus(400)
        }

        var account = "";
        var token = "";

        if ( req.body.account && req.body.token )
        {
            if ( isuuid.v4( req.body.account ) && req.body.token.length == 64 )
            {
                account = req.body.account
                token = req.body.token
            }
        }
        else if ( mode == 2 )
        {
            // Can't fetch bookmarks if we're not logged in
            mode = 0;
        }

        if ( mode == 2 )
        {
            sqlcon.query( "SELECT token FROM accounts WHERE id=?;",
            [ account ],
            function( aerr, arsql )
            {
                if ( aerr )
                {
                    console.log( "story-homepage: sql_error: ", aerr );
                    res.json({"status":"fail","reason":"un-caught sql error"})
                }
                else if ( arsql.length == 0 )
                {
                    console.log( "story-homepage: no account with id: " + account )
                    res.json({"status":"fail","reason":"no account with that id"})
                }
                else if ( arsql[0].token !== token )
                {
                    console.log("story-homepage: invalid security token for account: " + account )
                    res.json({"status":"fail","reason":"invalid security token"})
                }
                else
                {
                    sqlcon.query( "SELECT stories.*, accounts.username FROM story_bookmark INNER JOIN stories ON story_bookmark.story=stories.id INNER JOIN accounts ON stories.author=accounts.id WHERE story_bookmark.user=?;",
                    [ account ], function ( err, rsql )
                    {
                        if ( err )
                        {
                            console.log( "story-homepage: sql_error: ", err )
                            res.json({"status":"fail","reason":"un-caught sql error"})
                        }
                        else
                        {
                            var out = []

                            for ( var i = 0; i < rsql.length; i++ )
                            {
                                out.push({
                                    "id":rsql[i].id,
                                    "author":rsql[i].author,
                                    "username":rsql[i].username,
                                    "title":rsql[i].title,
                                    "views":rsql[i].views
                                })
                            }

                            console.log( "story-homepage: fetched bookmarked stories for account: " + account )
                            res.json({"status":"okay","stories":out})
                        }
                    });
                }
            });
        }
        else
        {
            var orderval = "stories.born"
            if ( mode == 1 )
            {
                orderval = "stories.views"
            }

            sqlcon.query( "SELECT stories.*, accounts.username FROM stories INNER JOIN accounts ON stories.author=accounts.id ORDER BY " + orderval + " DESC;",
            [], function( err, rsql )
            {
                if ( err )
                {
                    console.log( "story-homepage: sql_error: ", err )
                    res.json({"status":"fail","reason":"un-caught sql error"})
                }
                else
                {
                    var out = []

                    for ( var i = 0; i < rsql.length; i++ )
                    {
                        out.push({
                            "id":rsql[i].id,
                            "author":rsql[i].author,
                            "username":rsql[i].username,
                            "title":rsql[i].title,
                            "views":rsql[i].views
                        })
                    }

                    if ( mode == 1 )
                    {
                        console.log( "story-homepage: fetched most viewed stories" )
                    }
                    else
                    {
                        console.log( "story-homepage: fetched most recent stories" )
                    }

                    res.json({"status":"okay","stories":out})
                }
            });
        }
    });
}
