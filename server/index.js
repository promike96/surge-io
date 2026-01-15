const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const MAX_PLAYERS = 15;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("surge-io relay server\n");
});

const wss = new WebSocket.Server({ server });
const clients = new Map();
let idCounter = 1;

function send(socket, message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(message));
}

function broadcast(message, exceptId = null) {
  for (const [id, client] of clients.entries()) {
    if (exceptId && id === exceptId) continue;
    send(client.socket, message);
  }
}

function generateId() {
  const id = `p${idCounter}`;
  idCounter += 1;
  return id;
}

function ensureUniqueId(requestedId) {
  if (requestedId && !clients.has(requestedId)) return requestedId;
  let next = generateId();
  while (clients.has(next)) next = generateId();
  return next;
}

wss.on("connection", (socket) => {
  if (clients.size >= MAX_PLAYERS) {
    send(socket, { type: "full" });
    socket.close();
    return;
  }

  let clientId = null;

  socket.on("message", (raw) => {
    let message = null;
    try {
      message = JSON.parse(raw);
    } catch (err) {
      return;
    }
    if (!message || typeof message !== "object") return;

    if (message.type === "join") {
      const incoming = message.player || {};
      clientId = ensureUniqueId(incoming.id);
      const player = { ...incoming, id: clientId };
      const entry = { socket, player, state: null };
      clients.set(clientId, entry);

      const roster = [];
      for (const [id, client] of clients.entries()) {
        if (id === clientId) continue;
        roster.push({ player: client.player, state: client.state });
      }
      send(socket, { type: "welcome", id: clientId, players: roster });
      broadcast({ type: "player-joined", player }, clientId);
      return;
    }

    if (!clientId || !clients.has(clientId)) return;

    if (message.type === "state") {
      const entry = clients.get(clientId);
      if (!entry) return;
      entry.state = message.state || null;
      broadcast({ type: "state", id: clientId, state: entry.state }, clientId);
      return;
    }

    if (message.type === "bullet") {
      broadcast({ type: "bullet", bullet: message.bullet }, clientId);
    }
  });

  socket.on("close", () => {
    if (!clientId || !clients.has(clientId)) return;
    clients.delete(clientId);
    broadcast({ type: "player-left", id: clientId });
  });
});

server.listen(PORT, () => {
  console.log(`surge-io relay server on :${PORT}`);
});
