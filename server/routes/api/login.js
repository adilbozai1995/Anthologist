const fetch = require("node-fetch");

module.exports = (app) => {

    app.post('/api/signup', function(req, res) {

        console.log( "Got signup request" )

        if(!req.body
        || !req.body.username
        || !req.body.password
        || !req.body.email ) return res.sendStatus(400)

        const username = req.body.username
        const password = req.body.password
        const email = req.body.email

        console.log( username + ", " + password + ", " + email )

        const salt = crypto.randomBytes(32)

        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" )

        console.log(hashpass.toString("hex"), salt.toString("hex"))
    })

    app.post('/api/login', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.password ) return res.sendStatus(400)

        const username = req.body.username
        const password = req.body.password

        console.log( username + ", " + password )

        if ( username == "testuser" && password == "testpass" )
        {
            res.redirect( "/profile/" + username )
        }
        else
        {
            res.redirect( "/login?fail=1" )
        }

        if ( !req.body.email ) return res.sendStatus(400)

        const email = req.body.email

        console.log( username + ", " + password + ", " + email )

        const salt = crypto.randomBytes(32)

        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" )

        console.log(hashpass.toString("hex"), salt.toString("hex"))
    })
}
