const express = require('express')
const bodyParser = require('body-parser')
const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")
const app = express()
const port = 3070

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.sendFile('/html/homepage.html', {root: __dirname} );
})

app.get('/login', function(req, res) {
    res.sendFile('/html/login.html', {root: __dirname} );
})

app.get('/profile/:accountid', function(req, res) {

    const accountid = req.params.accountid

    if ( isuuid.v4( accountid ) )
    {
        console.log( "Valid UUID: " + accountid )
    }
    else
    {
        console.log( "Invalid UUID: " + accountid )
    }

    res.sendFile('/html/profile.html', {root: __dirname} );
})

app.get('/settings', function(req, res) {
    res.sendFile('/html/settings.html', {root: __dirname} );
})

app.get('/new-story', function(req, res) {
    res.sendFile('/html/new-story.html', {root: __dirname} );
})

app.get('/story/:storyid', function(req, res) {

    const storyid = req.params.storyid

    if ( isuuid.v4( storyid ) )
    {
        console.log( "Valid UUID: " + storyid )
    }
    else
    {
        console.log( "Invalid UUID: " + storyid )
    }

    res.sendFile('/html/story.html', {root: __dirname} );
})

app.get('/admin', function(req, res) {
    res.sendFile('/html/admin.html', {root: __dirname} );
})

app.post('/login_submit', function(req, res) {
    if ( !req.body || !req.body.username || !req.body.password ) return res.sendStatus(400)

    const mode = req.body.mode
    const username = req.body.username
    const password = req.body.password

    if ( mode == "login" )
    {
        console.log( username + ", " + password )

        if ( username == "testuser" && password == "testpass" )
        {
            res.redirect("/profile/" + username)
        }
        else
        {
            res.redirect("/login?fail=1")
        }
    }
    else if ( mode == "signup" )
    {
        if ( !req.body.email ) return res.sendStatus(400)

        const email = req.body.email

        console.log( username + ", " + password + ", " + email )

        const salt = crypto.randomBytes(64)

        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 64, "sha512" )

        console.log(hashpass.toString("hex"), salt.toString("hex"))
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
