const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3070

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    res.send("Anthologist backend!");
});

app.listen(port, (err) => {
    if ( err ) { console.log( err ); };
    console.log(`Anthologist backend server listening on port ${port}!`);
});
