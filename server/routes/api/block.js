const request = require("request")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/block-create', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.story
        || !req.body.text
        || typeof( req.body.ending ) === 'undefined' )
        {
            console.log( "block-create: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "block-create: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "block-create: invalid token" )
            return res.sendStatus(400)
        }

        const story = req.body.story

        if ( !isuuid.v4( story ) )
        {
            console.log( "block-create: invalid story: " + story )
            return res.sendStatus(400)
        }

        const blocktext = req.body.text

        if ( blocktext.length <= 0 )
        {
            console.log( "block-create: no block content" )
            return res.sendStatus(400)
        }

        const ending = req.body.ending

        if ( isNaN( ending ) || ending < 0 || ending > 1 )
        {
            console.log( "block-create: end of story is not a boolean" )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "block-create: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "block-create: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("block-create: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlcon.query( "SELECT * FROM stories WHERE id=?;", [story], function( err, srsql )
                {
                    if ( err )
                    {
                        console.log( "block-create: sql_error: ", err );
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( srsql.length <= 0 )
                    {
                        console.log( "block-create: no story with id: " + story )
                        res.json({"status":"fail","reason":"no story with that id"})
                    }
                    else if ( blocktext.length > srsql[0].charlimit )
                    {
                        console.log( "block-create: block excedes character limit: " + blocktext.length )
                        res.json({"status":"fail","reason":"block too long"})
                    }
                    else if ( ending && srsql[0].iteration < srsql[0].storylen )
                    {
                        console.log( "block-create: tried to end story early" )
                        res.json({"status":"fail","reason":"ended story early"})
                    }
                    else
                    {
                        const author = srsql[0].author
                        const curiter = srsql[0].iteration

                        sqlcon.query( "SELECT * FROM story_writers WHERE story=?;", [story], function( err, wrsql )
                        {
                            var canPost = false;

                            if ( err )
                            {
                                console.log( "block-create: sql_error: ", err );
                                res.json({"status":"fail","reason":"un-caught sql error"})
                            }
                            else if ( wrsql.length <= 0 )
                            {
                                canPost = true;
                            }
                            else if ( account === author )
                            {
                                canPost = true;
                            }
                            else
                            {
                                for ( var i = 0; i < wrsql.length; i++ )
                                {
                                    if ( account === wrsql[i].writer )
                                    {
                                        canPost = true;
                                        break;
                                    }
                                }
                            }

                            if ( canPost )
                            {
                                const blockid = uuid()
                                const rightnow = Date.now() / 1000;

                                sqlsec.query( "INSERT INTO blocks (id, content, story, iteration, author, ending, born) VALUES (?, ?, ?, ?, ?, ?, ?);",
                                [
                                    blockid,
                                    blocktext,
                                    story,
                                    curiter,
                                    account,
                                    ending,
                                    rightnow
                                ], function(ca,cb){});

                                console.log( "block-create: posted new block: " + blockid )
                                res.json({"status":"okay","block":blockid})
                            }
                            else
                            {
                                console.log( "block-create: no permission to post block" )
                                res.json({"status":"fail","reason":"no permission to post"})
                            }
                        });
                    }
                });
            }
        });
    });

    app.post('/api/block-delete', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.block)
        {
            console.log( "block-delete: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "block-delete: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "block-delete: invalid token" )
            return res.sendStatus(400)
        }

        const block = req.body.block

        if ( !isuuid.v4( block ) )
        {
            console.log( "block-delete: invalid block: " + block )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "block-delete: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "block-delete: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("block-delete: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlcon.query( "SELECT stories.votemode FROM blocks INNER JOIN stories ON blocks.story = stories.id WHERE blocks.id=?;",
                [block], function( err, brsql )
                {
                    if ( err )
                    {
                        console.log( "block-delete: sql_error: ", err );
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( brsql.length <= 0 )
                    {
                        console.log( "block-delete: no block with id: " + block )
                        res.json({"status":"fail","reason":"no story with that id"})
                    }
                    else if ( brsql[0].votemode > 0 )
                    {
                        console.log( "block-delete: voting in progress, failed to delete block: " + block )
                        res.json({"status":"fail","reason":"voting in progress"})
                    }
                    else
                    {
                        sqlsec.query( "DELETE FROM blocks WHERE id=?;", [block], function( a, b ) {})

                        console.log( "block-delete: deleted block: " + block )
                        res.json({"status":"okay"})
                    }
                });
            }
        });
    });

    app.post('/api/block-edit', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.block
        || !req.body.text)
        {
            console.log( "block-edit: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "block-edit: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "block-edit: invalid token" )
            return res.sendStatus(400)
        }

        const block = req.body.block

        if ( !isuuid.v4( block ) )
        {
            console.log( "block-edit: invalid block: " + block )
            return res.sendStatus(400)
        }

        const blocktext = req.body.text

        if ( blocktext.length <= 0 )
        {
            console.log( "block-edit: no content: " + block )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "block-edit: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "block-edit: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("block-edit: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlcon.query( "SELECT stories.votemode, stories.charlimit FROM blocks INNER JOIN stories ON blocks.story = stories.id WHERE blocks.id=?;",
                [block], function( err, brsql )
                {
                    if ( err )
                    {
                        console.log( "block-edit: sql_error: ", err );
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( brsql.length <= 0 )
                    {
                        console.log( "block-edit: no block with id: " + block )
                        res.json({"status":"fail","reason":"no story with that id"})
                    }
                    else if ( brsql[0].votemode > 0 )
                    {
                        console.log( "block-edit: voting in progress, failed to delete block: " + block )
                        res.json({"status":"fail","reason":"voting in progress"})
                    }
                    else if ( blocktext.length > brsql[0].charlimit )
                    {
                        console.log( "block-edit: new block length too long: " + blocktext.length )
                        res.json({"status":"fail","reason":"block too long"})
                    }
                    else
                    {
                        sqlsec.query( "UPDATE blocks SET content=? WHERE id=?;", [blocktext, block], function( a, b ) {})

                        console.log( "block-edit: updated text for block: " + block )
                        res.json({"status":"okay"})
                    }
                });
            }
        });
    });

    app.post('/api/block-flag', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.flag)
        {
            console.log( "block-flag: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "block-flag: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "block-flag: invalid token" )
            return res.sendStatus(400)
        }

        const flag = req.body.flag

        if ( !isuuid.v4( flag ) )
        {
            console.log( "block-flag: invalid block: " + flag )
            return res.sendStatus(400)
        }

        request.post( "http://localhost:3070/api/validate", {json:{"account":account,"token":token}}, function(verr, vres, body)
        {
            if ( verr )
            {
                console.log( "block-flag: validate request error: ", verr )
                res.json({"status":"fail","reason":"unable to authenticate"})
            }
            else if ( String(body).indexOf("'fail'") > 0 )
            {
                console.log( "block-flag: invalid authentication token for account: " + account )
                res.json({"status":"fail","reason":"invalid authentication token"})
            }
            else
            {
                sqlsec.query("UPDATE blocks SET flag=? WHERE id=? AND flag='no_flag';", [ account, flag ], function( err, rsql )
                {
                    if ( err )
                    {
                        console.log( "block-flag: sql_error: ", err )
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( rsql.affectedRows < 1 )
                    {
                        console.log("block-flag: block already flagged or doesn't exist: (FLAG:" + flag + "|ACCT:" + account + ")" )
                        res.json({"status":"fail","reason":"block already flaged or doesn't exist"})
                    }
                    else
                    {
                        console.log("block-flag: block: " + flag + " flagged by: " + account)
                        res.json({"status":"okay"})
                    }
                });
            }
        });
    });

    app.post('/api/block-vote', function(req, res)
    {
        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.block)
        {
            console.log( "block-vote: missing fields" )
            return res.sendStatus(400)
        }

        const account = req.body.account
        const token = req.body.token

        if ( !isuuid.v4( account ) )
        {
            console.log( "block-vote: invalid account: " + account )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "block-vote: invalid token" )
            return res.sendStatus(400)
        }

        const block = req.body.block

        if ( !isuuid.v4( block ) )
        {
            console.log( "block-vote: invalid block: " + block )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;", [account], function( err, arsql )
        {
            if ( err )
            {
                console.log( "block-vote: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "block-vote: no account with id: " + account )
                res.json({"status":"fail","reason":"no account with that id"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("block-vote: invalid security token for account: " + account )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                sqlcon.query( "SELECT blocks.story, blocks.iteration AS blockIter, stories.votemode, stories.iteration FROM blocks INNER JOIN stories ON blocks.story = stories.id WHERE blocks.id=?;",
                [block], function( err, srsql )
                {
                    if ( err )
                    {
                        console.log( "block-vote: sql_error: ", err );
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( srsql.length <= 0 )
                    {
                        console.log( "block-vote: no block with id: " + block )
                        res.json({"status":"fail","reason":"no story with that id"})
                    }
                    else if ( srsql[0].blockIter < srsql[0].iteration || srsql[0].votemode > 0 )
                    {
                        sqlsec.query( "INSERT INTO votes (user, block) VALUES (?, ?);",
                        [ account, block ], function( err, vrsql )
                        {
                            if ( err )
                            {
                                if ( err.code === 'ER_DUP_ENTRY' )
                                {
                                    console.log( "block-vote: account: " + account + ", cannot vote twice on block: " + block )
                                    res.json({"status":"fail","reason":"duplicate vote"})
                                }
                                else
                                {
                                    console.log( "block-vote: sql_error: ", err );
                                    res.json({"status":"fail","reason":"un-caught sql error"})
                                }
                            }
                            else
                            {
                                sqlsec.query( "UPDATE blocks SET rating = rating + 1 WHERE id=?;", [block]);

                                console.log( "block-vote: account: " + account + ", voted for block: " + block )
                                res.json({"status":"okay"})
                            }
                        });
                    }
                    else
                    {
                        console.log( "block-vote: not voting time right now, account: " + account )
                        res.json({"status":"fail","reason":"not voting time"})
                    }
                });
            }
        });
    });
}
