const express = require('express')
const app = express()
const port = 3070

app.get('/', function(req, res) {
    res.sendFile('/html/homepage.html', {root: __dirname} );
})

app.get('/login', function(req, res) {
    res.sendFile('/html/login.html', {root: __dirname} );
})

app.get('/profile', function(req, res) {
    res.sendFile('/html/profile.html', {root: __dirname} );
})

app.get('/settings', function(req, res) {
    res.sendFile('/html/settings.html', {root: __dirname} );
})

app.get('/new-story', function(req, res) {
    res.sendFile('/html/new-story.html', {root: __dirname} );
})

app.get('/story', function(req, res) {
    res.sendFile('/html/story.html', {root: __dirname} );
})

app.get('/admin', function(req, res) {
    res.sendFile('/html/admin.html', {root: __dirname} );
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
