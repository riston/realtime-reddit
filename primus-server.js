var Primus   = require('primus'),
    express  = require('express'),
    bunyan   = require('bunyan'),
    amqp     = require('amqp'),
    http     = require('http'),
    path     = require('path'),
    config   = require('config'),
    morgan   = require('morgan'),
    mongojs  = require('mongojs'),
    compress = require('compression'),
    config   = config.server,
    app      = express(),
    rabbitmq,
    server,
    primus,
    log,
    db;

log = bunyan.createLogger({ name: 'web-app' });

// Mongo connection
db = mongojs(config.mongodb.uri, [ 'posts' ]);

// RabbitMQ connection
rabbitmq = amqp.createConnection({
    url: config.rabbitmq.url
});

// app.use(morgan());
app.use(compress());
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Pass the express instance to http server
server = http.createServer(app);

primus = new Primus(server, {
    transformer: 'websockets'
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/api/posts', function (req, res) {

    db.posts.find().sort({ created: -1}).limit(20).toArray(response(res));
});

app.get('/partials/:partial', function (req, res) {

    res.render('partials/' + req.params.partial);
});

function response (res) {

    return function (err, posts) {

        if (err) {

            return res.json(500, {
                'status': 'error',
                'message': 'Failed to get the database results'
            });
        }

        return res.json(posts);
    };
}

// Primus part
primus.on('connection', function (spark) {

    spark.on('data', function (message) {

        if (message.type && message.type === 'new-message') {

            // Override the date property in server side
            message.created = new Date();

            // Add the validation for the message, all the client sent messages


            // Save the result in database
            db.posts.save(message, function (err, doc) {
                console.log('Saved', err, doc);

                rabbitmq.publish(config.rabbitmq.queue.name,
                    JSON.stringify(doc), {
                    deliveryMode: 2
                });
            });

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

