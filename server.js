var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cors = require('cors');

app.use(cors());

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3001);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

server.listen(app.get('port') ,app.get('ip'), function () {
    console.log("✔ Express server listening at %s:%d ",
                app.get('ip'),
                app.get('port'));
});

function getDrones(callback) {
    var msg = [
        [28.170489, 83.045654],
        [27.782392, 84.413452],
        [28.339036, 82.174988],
        [27.563475, 84.968262],
        [28.383346, 84.693604],
        [27.835838, 83.732300]
    ];

    return callback(msg);
}

io.on('connection', function (socket) {
    var drones = setInterval(function () {
        getDrones(function (data) {
            socket.volatile.emit('drones', data);
        });

    }, 5 * 1000);

    socket.on('disconnect', function () {
        clearInterval(drones);
    });
});
