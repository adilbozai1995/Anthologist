const fetch = require("node-fetch");
const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/signup', function(req, res) {

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
        || !req.body.email
        || !req.body.password ) return res.sendStatus(400)

        const email = req.body.email
        const password = req.body.password

        console.log( email + ", " + password )

        const salt = ""
        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" )

        console.log(hashpass.toString("hex"), salt.toString("hex"))
    })
}
