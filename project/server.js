const express = require("express")
const http    = require("http")
const WebSocket = require("ws")

const app    = express()
const server = http.createServer(app)
const wss    = new WebSocket.Server({ server })

// servir archivos estáticos
app.use(express.static(__dirname));

// enviar un mensaje a TODOS los clientes conectados
function broadcast(obj) {
  const msg = JSON.stringify(obj)
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg)
  })
}

wss.on("connection", (ws) => {
  // avisar a todos (incluido el que acaba de entrar) cuántos hay
  broadcast({ type: "users", count: wss.clients.size })

  ws.on("message", (msg) => {
    const data = JSON.parse(msg)

    // reenviar evento de pad a todos menos al emisor
    if (data.type === "pad") {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg.toString())
        }
      })
    }
  })

  ws.on("close", () => {
    // actualizar el contador cuando alguien se desconecta
    broadcast({ type: "users", count: wss.clients.size })
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log("Server running on port", PORT))
