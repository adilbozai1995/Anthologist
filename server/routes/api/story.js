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
        || typeof(req.body.writers) === 'undefined' ) // CSV of writers
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

        const charlimit = req.body.charlimit

        if ( charlimit > 65536 )
        {
            console.log( "story-create: charlimit too long: " + charlimit )
            return res.sendStatus(400)
        }

        const minblock = req.body.minblock
        const votetime = req.body.votetime

        if ( votetime > 1440 )
        {
            console.log( "story-create: vote time too long: " + votetime )
            return res.sendStatus(400)
        }

        const storylen = req.body.storylen

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

                sqlsec.query( "INSERT INTO stories (id, author, title, charlimit, minblock, votetime, storylen) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    storyid,
                    account,
                    title,
                    charlimit,
                    minblock,
                    votetime,
                    storylen
                ]);

                for ( var i = 0; i < writers.length; i++ )
                {
                    if ( isuuid.v4( writers[i] ) )
                    {
                        sqlsec.query( "INSERT INTO story_writers (writer, story) VALUES (?, ?)",
                        [
                            writers[i],
                            storyid
                        ]);
                    }
                }

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

        const votetime = req.body.votetime

        if ( votetime > 1440 )
        {
            console.log( "story-editvote: vote time too long: " + votetime )
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
                sqlsec.query("UPDATE stories SET votetime=? WHERE id=?;",
                [
                    votetime,
                    story
                ]);

                console.log("story-editvote: updated edit time on story: " + story + ", time is: " + votetime + " minutes" );
                res.json({"status":"okay"});
            }
        });
    });

    app.post('/api/story-fetch', function(req, res)
    {
        if( !req.body || !req.body.story )
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
                console.log( "story-fetch: fetched story with id: " + story )
                res.json({
                    "status":"okay",
                    "author":rsql[0].author,
                    "title":rsql[0].title,
                    "flag":rsql[0].flag,
                    "charlimit":rsql[0].charlimit,
                    "minblock":rsql[0].minblock,
                    "votetime":rsql[0].votetime,
                    "storylen":rsql[0].storylen
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
                sqlsec.query("INSERT INTO stories (user, story) VALUES (?, ?);",
                [
                    account,
                    story
                ]);

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

                console.log( "story-remove: admin: " + account + ", deleted story: " + story )
                res.json({"status":"okay"})
            }
        });
    });
}
