const net = require('net');

const port = 5500;

for(let i = 1; i <= 254; i++) {
    const target = `172.16.3.${i}`;

    const socket = new net.Socket();

    socket.setTimeout(1500);

    socket.on('connect', function() {
        console.log(target + ': Port ' + port + ' is open');
        socket.destroy();
    });

    socket.on('timeout', function() {
        socket.destroy();
    });

    socket.on('error', function() {
        console.log(target + ': Port ' + port + ' is closed');
    });

    socket.connect(port, target);
}
