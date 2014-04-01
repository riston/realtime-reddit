var Primus  = require('primus'),
    express = require('express'),
    http    = require('http'),
    app     = express();

app.use('/public', express.static(__dirname + '/public'));

// Pass the express instance to http server
var server = http.createServer(app),
    primus = new Primus(server, {
        transformer: 'websockets'
    });

primus.on('connection', function(socket) {
    socket.on('data', function ping(message) {

        console.log('recieved a new message', message);

        socket.write({
            ping: 'pong'
        });
    });
});

// And listen on the HTTP server.
server.listen(process.env.PORT || 8080);
