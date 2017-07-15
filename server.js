// read in some data and ifgure out what exactly its asking
// based on that grab some info back in a formatted response
// close connection
// handle one connection at a time
// a good name would be request - the anonymous function on your server (as opposed to client connection)
// it'll be an object with a method 'on 'data'' - set up a console log to spit out what is data
// then go to curl and make a request to your end point and see what is already given to you -
// what does curl include in the header to begin with

const net = require('net');
const fs = require('fs');

const server = net.createServer();

server.listen(8080, '0.0.0.0', connectionListen);

function connectionListen (){
  console.log ('Server is now listening to port 8080.');
}

function generateHeader(status){
  var statusHeader;
  if (status === 200){
    statusHeader = 'HTTP/1.1 ' + status + ' OK\n';
  } else if (status === 404){
    statusHeader = 'HTTP/1.1 ' + status + ' NOT FOUND\n';
  }

  //this should also be able to pass status code 404
  var dateHeader = 'Date: ' + new Date().toUTCString() + '\n';
  var serverHeader = 'Server: Poops McGee\n\n';

  var header = statusHeader + dateHeader + serverHeader;

  return header;

}

console.log(generateHeader());

server.on('connection', connectionEstablished);

function connectionEstablished(connection){

  console.log('connection established');

  connection.on('data', (input) => {
    console.log('REQUEST');
    console.log(input.toString());

    var requestLinesArr = input.toString().split('\n');

    // console.log(requestLinesArr);

    var method = requestLinesArr[0].split(' ')[0];
    // console.log('METHOD');
    // console.log(method);

    var path = requestLinesArr[0].split(' ')[1];
    // console.log('PATH');
    // console.log(path);

    generateResponse(method, path, connection);

  });

}

function generateResponse(method, path, connection){

  var status = 200;

  var validPathArr = ['/index.html', '/hydrogen.html', '/helium.html', '/css/styles.css'];
  if (validPathArr.indexOf(path) === -1){
    if (path === '' || path === ' ' || path === '/'){
      path = '/index.html';
    } else {
      path = '/404.html';
      status = 404;
    }
  }

  var header = generateHeader(status);

  fs.readFile(('.' + path), function read(err, data) {
      if (err) {
        console.log('errrrrrroooorrrr');
        connection.write('HTTP/1.1 500 ERROR');
      } else {
        var body = data;
        // can I do a return body here to the outside generateResposne function?
        var content;

        if(method === 'HEAD'){
          content = header;
        } else if (method === 'GET'){
          content = header + body;
        }

        connection.write(content);
      }
    connection.end();
  });
}

// function processFile() {
//     console.log(content);
// }

// this is what happens when I hit my server using curl -I localhost:8080 command
// HEAD / HTTP/1.1
// Host: localhost:8080
// User-Agent: curl/7.51.0
// Accept: */*

// so, my server's set up to listen for data from connections and print out any data that gets sent to it
// when I hit it with curl -I, I print out the data that got sent to it which is HTTP headers