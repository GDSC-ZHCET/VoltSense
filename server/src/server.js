const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received raw message: ${message}`);

    try {
      // Attempt to parse the message as JSON
      const parsedMessage = JSON.parse(message);
      console.log("Parsed message:", parsedMessage);

      // Broadcast the parsed JSON to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage)); // Send as JSON string
        }
      });
    } catch (error) {
      console.error("Invalid JSON received:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
