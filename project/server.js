const express = require("express")
const http = require("http")
const WebSocket = require("ws")

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// servir frontend
app.use(express.static("public"))

// websocket
wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    // reenviar a todos menos al que envió
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString())
      }
    })
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log("Server running on", PORT))