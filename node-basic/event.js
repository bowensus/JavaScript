const EventEmitter = require('events');
const http = require('http');

const myEmitter = new EventEmitter();

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: ");
});

myEmitter.on("newSale", stock => {
  console.log(`There are new ${stock} items left in stock.`);
});

myEmitter.emit("newSale");

/////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log("Request recieved");
  res.end("Request recieved");
});

server.on('request', (req, res) => {
  console.log("Another request 😄");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests... 127.0.0.1:8000');
});
