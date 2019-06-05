const express = require("express");
const SocketServer = require("ws").Server;
const uuid = require("uuid");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.on("connection", ws => {
    
    wss.broadcast = function broadcast(message) {
        wss.clients.forEach(function each(client) {
          if (client.readyState === SocketServer.OPEN) {
            client.send(message);
          }
        });
      };
      
      wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
          // Broadcast to everyone else.
          const id = JSON.parse(message).id;
        const username = JSON.parse(message).username;
        const content = JSON.parse(message).content;
          
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === SocketServer.OPEN) {
              client.send('User', username , 'said', content, 'id', id);
            }
          });
        });
      });    


//         ws.on('message', function incoming(message) {
//         const id = JSON.parse(message).id;
//         const username = JSON.parse(message).username;
//         const content = JSON.parse(message).content;

//         console.log('User', username , 'said', content, 'id', id);
//       });
//       ws.send("message from server")
//   console.log("Client connected");

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => console.log("Client disconnected"));
});