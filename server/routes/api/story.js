const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/story-create', function(req, res) {

        if(!req.body
        || !req.body.account
        || !req.body.token
        || !req.body.title
        || !req.body.charlimit   // Character limit per block
        || !req.body.minblock    // Min blocks before voting starts
        || !req.body.votetime   // How long to keep voting open for (minutes)
        || !req.body.storylen )  // Min number of blocks before story can end
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

        sqlcon.query( "SELECT token FROM accounts WHERE id=?;",
            [ account ],
            function( aerr, arsql )
            {
                if ( aerr )
                {
                    console.log( "create-story: sql_error: ", aerr );
                    res.json({"status":"fail","reason":"un-caught sql error"})
                }
                else
                {
                    if ( arsql.length > 0 )
                    {
                        if ( arsql[0].token === token )
                        {
                            const storyid = uuid( )

                            sqlcon.query( "INSERT INTO story (id, author, title, charlimit, minblock, votetime, storylen) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            [
                                storyid,
                                account,
                                title,
                                charlimit,
                                minblock,
                                votetime,
                                storylen
                            ]);

                            console.log("story-create: created new story: " + title );
                            res.json({"status":"okay","story":storyid});
                        }
                        else
                        {
                            console.log("story-create: invalid security token for account: " + account )
                            res.json({"status":"fail","reason":"invalid security token"})
                        }
                    }
                    else
                    {
                        console.log( "story-create: no account with id: " + account )
                        res.json({"status":"fail","reason":"no account with that id"})
                    }
                }
            }
        );
    });
}
