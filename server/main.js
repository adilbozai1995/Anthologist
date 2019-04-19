const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const nodemail = require('nodemailer')
const port = 3070

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    out = "<h1>Anthologist backend!</h1><br>";

    app._router.stack.forEach(function(r)
    {
        if (r.route && r.route.path && r.route.path != "/") out += r.route.path + "<br>"
    });

    res.send( out )
});

// Connect to the database as the insecure bot. use for reading data
var db1 = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'service',
    password: '9nQzDKe2kDs+y7o2VArScg==',
    database: 'Anthologist'
});

db1.connect(function(err) {
    if (err) {
        return console.error('MySQL error: ' + err.message);
    }
    console.log('Connected to the MySQL server as: service');
});
global.sqlcon = db1;

// Connect to the database as the secure bot. use for writing data.
var db2 = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'serviceSecure',
    password: 'C+n9NscBcHbYPmAp6cN5Hw==',
    database: 'Anthologist'
});

db2.connect(function(err) {
    if (err) {
        return console.error('MySQL error: ' + err.message);
    }
    console.log('Connected to the MySQL server as: serviceSecure');
});
global.sqlsec = db2;

global.mailer = nodemail.createTransport({
    service: 'gmail',
    auth: {
        user: 'anthologist.noreply@gmail.com',
        pass: 'Team36rocks!'
    }
});

app.listen(port, (err) => {
    if ( err ) { console.log( err ); };
    console.log(`Anthologist backend server listening on port ${port}!`);
});

setInterval( function( )
{
    sqlcon.query( "SELECT * FROM stories;", [], function( err, srsql )
    {
        if ( err )
        {
            console.log( "update-loop: uncaught sql exception: " + err )
        }
        else
        {
            for ( var i = 0; i < srsql.length; i++ )
            {
                const story = srsql[i]

                // Skip finished stories
                if ( story.ended == 1 ) continue;

                sqlcon.query( "SELECT COUNT(id) AS blockCount, MAX(rating) AS blockRating FROM blocks WHERE story=? AND iteration=?;",
                [ story.id, story.iteration ], function( err, brsql )
                {
                    const rightnow = Date.now() / 1000;

                    if ( err )
                    {
                        console.log( "update-loop: uncaught sql exception 2: " + err )
                    }
                    else if ( story.votemode == 1 && story.votestart + (story.votetime * 60) < rightnow )
                    {
                        sqlcon.query( "SELECT id, ending FROM blocks WHERE story=? AND iteration=? AND rating=? LIMIT 1;",
                        [
                            story.id,
                            story.iteration,
                            brsql[0].blockRating
                        ], function( err, vrsql )
                        {
                            if ( err )
                            {
                                console.log( "update-loop: uncaught sql exception 3: " + err )
                            }
                            else if ( vrsql.length <= 0 )
                            {
                                console.log( "update-loop: no winning rows returned: " + vrsql )
                            }
                            else
                            {
                                // Delete everything except that one row
                                sqlsec.query( "DELETE FROM blocks WHERE story=? AND iteration=? AND id<>?;",
                                [
                                    story.id,
                                    story.iteration,
                                    vrsql[0].id
                                ], function( err, drsql )
                                {
                                    if ( err )
                                    {
                                        console.log( "update-loop: uncaught sql exception 4: " + err )
                                    }
                                    else
                                    {
                                        // Move to next iteration
                                        sqlsec.query( "UPDATE stories SET votemode=0, iteration=iteration+1, ended=? WHERE id=?;",
                                        [
                                            vrsql[0].ending,
                                            story.id
                                        ]);

                                        console.log( "update-loop: entering next iteration for story: " + story.id )
                                    }
                                });
                            }
                        });
                    }
                    else if ( story.votemode == 0 && brsql[0].blockCount >= story.minblock )
                    {
                        // Editing/Deleting period ended, start voting
                        sqlsec.query( "UPDATE stories SET votemode=1, votestart=? WHERE id=?;",
                        [
                            rightnow,
                            story.id
                        ]);

                        console.log( "update-loop: now entering voting mode for story: " + story.id )
                    }
                });
            }
        }
    });
}, 10000 ); // Run every 10 seconds
