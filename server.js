// read in some data and ifgure out what exactly its asking
// based on that grab some info back in a formatted response
// close connection
// handle one connection at a time
// a good name would be request - the anonymous function on your server (as opposed to client connection)
// it'll be an object with a method 'on 'data'' - set up a console log to spit out what is data
// then go to curl and make a request to your end point and see what is already given to you -
// what does curl include in the header to begin with

const net = require('net');

const server = net.createServer();

server.listen(8080, '0.0.0.0', connectionListen);

function connectionListen (){
  console.log ('Server is now listening to port 8080.');
}


server.on('connection', connectionEstablished);

function connectionEstablished(connection){

  console.log('connection established');

  connection.on('data', (input) => {
    console.log(input.toString());
  });

}