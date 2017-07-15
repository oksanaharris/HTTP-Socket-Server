
// The client will run once, then exit.

// X - 1. Create a client to establish TCP socket connections to HTTP servers
// X - 1. Transmit 'standard' HTTP Headers to the server
// X - 1. Wait for a response from the server
// X - 1. When the server responds, display the response message body to the terminal

// 1. The node command requires a single argument, the host and uri to request a resource from
//   - example: `www.devleague.com/apply`
// 1. If the node client is run with no arguments, display a "help/usage" message that explains how to use your client, including all available options

// example usage:

// ```
// node client.js www.devleague.com
// ```

// #### HTTP Request Headers

// X - Send at least these headers in each request

// X - 1. The proper METHOD and URI should be used in the **Request Line**
// X - 1. Date : The current timestamp should be sent in RFC1123 format
// X - 1. Host : The name or ip address of the host that is being connected
// X - 1. User-Agent : The name of your custom http client

// #### HTTP Response Headers

// X - Parse the response headers, and store them in a hash table for later use.

// ### Testing

// Test by requesting web servers with domain names, and your own running `server.js`

// ```
// node client.js www.devleague.com
// node client.js localhost
// ```

// ### Features

// ??? - 1. Pipe the response content stream to stdout
// X - 1. CLI Option to set the request method to use
// X - 1. CLI Option to display headers only (instead of content body)
// X - 1. CLI Option to set the port to use to connect to the server
// 1. Error Handling
//   1. Handle the case where the HTTP Request is a client error (40x)
//   1. Handle the case where the host can not be reached
//   1. Handle the case where the host is found, and not listening on port 80
//   1. Handle the case where the host is found and listening on the specified port, and not returning a valid HTTP Response
//   1. Handle the case where the HTTP Response results in a server error (50x)
//   1. Handle any other errors that you may encounter

// ### Advanced Client

// Allow the client to send a valid POST request with a message body to a server.

// ### 2Advanced Client

// Allow CLI Option to save the response message body as a file specified by the client.
// For example:

// ```
// node client.js -save devleague.com_index.html http://www.devleague.com
// ```

// would save the contents of the response message from requesting http://www.devleague.com to a file named `devleague.com_index.html`


const net = require('net');

const argArr = process.argv;
argArr.shift();
argArr.shift();

// console.log(cliArgs);

const requestObj = {
  method: argArr[0],
  path: argArr[1],
  server: argArr[2],
  port: argArr[3],
  headeronly: argArr[4]
}

console.log('REQUEST OBJECT');
console.log(requestObj);

const headerObj = {
  status: 'num',
  date: 'date',
  server: 'server'
};



//this should be able to accept an argument for the port
const serverConnection = net.createConnection(requestObj.port, '0.0.0.0', connectListener);

function connectListener(){
  console.log('i am making a connection');

  process.stdin.on('data', (input) => {
    //getting the right arguments
    // var argArr = input.toString().slice(0, -1).split(' ');
    // console.log(argArr);

    // var request = generateRequestHeader(argArr[0], argArr[1], argArr[2]);
    //sending the request with headers
    // serverConnection.write(request);
  });

  var request = generateRequestHeader(requestObj.method, requestObj.path, requestObj.server, requestObj.port, requestObj.headeronly);
  serverConnection.write(request);

  serverConnection.on('data', (input) => {
    // console.log(input.toString());
    var headerBodyArr = input.toString().split('\n\n');
    var header = headerBodyArr[0];
    var body = headerBodyArr[1];

    console.log('HEADER');
    console.log(header);

    // process.stdout('HEADER');
    // process.stdout(header);

    parseHeader(header);
    // console.log('HEADER OBJECT');
    // console.log(headerObj);

    console.log('BODY');
    console.log(body);

    // serverConnection.end();
    // not sure how to close.....

  });
}

function parseHeader(headerStr){
  var headerLinesArr = headerStr.split('\n');
  var status = headerLinesArr[0].split(' ')[1];
  var date = headerLinesArr[1].substring(6);
  var server = headerLinesArr[2].substring(8);

  headerObj.status = status;
  headerObj.date = date;
  headerObj.server = server;
}

//server argument should be a CLI argument
function generateRequestHeader(method, path, server, port, headeronly){

  console.log(headeronly);
  console.log(method);

  if(headeronly === 'true'){
    method = 'HEAD';
    console.log('resetting method to ' + method);
  }

  var requestLine = method + ' ' + path + ' HTTP/1.1\n';
  var dateHeader = 'Date: ' + new Date().toUTCString() + '\n';
  var hostHeader = 'Host: ' + server + ':' + port + '\n';
  var userAgentHeader = 'User-Agent: ' + 'Custom HTTP Client\n';
  var acceptHeader = 'Accept: */*\n\n';

  var header = requestLine + dateHeader + hostHeader + userAgentHeader + acceptHeader;

  return header;
}

// GET /index.html HTTP/1.1
// Host: localhost:8080
// User-Agent: curl/7.51.0
// Accept: */*


