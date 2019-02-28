const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    fs.readdirSync('routes/api/').forEach((file) => {
        if ( !file.startsWith(".") )
        {
            var fname = file.substr( 0, file.indexOf('.') );
            require('./api/' + fname)(app);
        }
    })
}
