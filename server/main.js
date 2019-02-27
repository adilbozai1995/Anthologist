const express = require('express')
const bodyParser = require('body-parser')
const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")
const app = express()
const port = 3070

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    res.send("Anthologist backend!")
})

app.listen(port, () => console.log(`Anthologist backend server listening on port ${port}!`))
