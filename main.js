const express = require('express')
const bodyParser = require('body-parser')
const crypto = require("crypto")
const app = express()
const port = 3070

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.sendFile('/html/homepage.html', {root: __dirname} );
})

app.get('/login(.html)?', function(req, res) {
    res.sendFile('/html/login.html', {root: __dirname} );
})

app.get('/profile(.html)?', function(req, res) {
    res.sendFile('/html/profile.html', {root: __dirname} );
})

app.get('/settings(.html)?', function(req, res) {
    res.sendFile('/html/settings.html', {root: __dirname} );
})

app.get('/new-story(.html)?', function(req, res) {
    res.sendFile('/html/new-story.html', {root: __dirname} );
})

app.get('/story(.html)?', function(req, res) {
    res.sendFile('/html/story.html', {root: __dirname} );
})

app.get('/admin(.html)?', function(req, res) {
    res.sendFile('/html/admin.html', {root: __dirname} );
})

app.post('/login_submit', function(req, res) {
    if ( !req.body || !req.body.username || !req.body.password ) return res.sendStatus(400)

    const mode = req.body.mode
    const username = req.body.username
    const password = req.body.password

    if ( mode == "login" )
    {
        console.log( mode + ", " + username + ", " + password )

        if ( username == "testuser" && password == "testpass" )
        {
            res.redirect("/profile?owner=" + username)
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

        const salt = crypto.randomBytes(64)

        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 64, "sha512" )

        console.log(hashpass.toString("hex"), salt.toString("hex"))
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
