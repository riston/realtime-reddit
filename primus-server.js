var Primus  = require('primus'),
    express = require('express'),
    http    = require('http'),
    config  = require('config').server,
    app     = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static(__dirname + '/public'));

// Pass the express instance to http server
var server = http.createServer(app),
    primus = new Primus(server, {
        transformer: 'websockets'
    });

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/partials/:partial', function (req, res) {
    res.render('partials/' + req.params.partial);
});

primus.on('connection', function (spark) {

    spark.on('data', function (message) {

        if (message.type && message.type === 'new-message') {

            // Override the date property in server side
            message.created = new Date();

            // Add the validation for the message, all the client sent messages

            // Broadcasting to all the connected sparks
            primus.forEach( function (socket, id, connections) {

                // Same id found
                if (spark.id === id) {
                    return;
                }

                // Send message to all the connected users
                socket.write(message);
            });
        }

    });
});

// And listen on the HTTP server.
server.listen(process.env.PORT || 8080);

