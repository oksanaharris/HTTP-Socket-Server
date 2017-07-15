const net = require('net');

const serverConnection = net.createConnection(8080, '0.0.0.0', connectListener);

function connectListener(){
  console.log('i am making a connection');

  process.stdin.on('data', (input) => {
    serverConnection.write(input.toString());
  });
}

