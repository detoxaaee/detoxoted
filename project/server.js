const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Creamos el servidor de WebSockets acoplado a Express
const wss = new WebSocket.Server({ server });

// Servir todos los archivos de tu proyecto (HTML, JS, parches .pd)
app.use(express.static(__dirname));

// Lógica de comunicación entre dispositivos
wss.on('connection', (ws) => {
    console.log('¡Un dispositivo se ha conectado por WebSocket!');

    // Cuando un teléfono envía datos de sus sensores:
    ws.on('message', (message) => {
        // Retransmitir el mensaje a TODOS los demás dispositivos conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message); 
            }
        });
    });
});

// Render asigna el puerto automáticamente mediante process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
