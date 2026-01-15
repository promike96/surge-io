const http = require("http");
const WebSocket = require("ws");
const { createGame, MAX_PLAYERS } = require("./engine");

const PORT = process.env.PORT || 8080;
const TICK_RATE = 30;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("surge-io authoritative server\n");
});

const wss = new WebSocket.Server({ server });
const game = createGame();
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
      if (clients.size >= MAX_PLAYERS) {
        send(socket, { type: "full" });
        socket.close();
        return;
      }
      const incoming = message.player || {};
      clientId = ensureUniqueId(incoming.id);
      const profile = {
        id: clientId,
        name: typeof incoming.name === "string" ? incoming.name : "Pilot",
        skinId: incoming.skinId,
        skinColor: incoming.skinColor,
        shieldColor: incoming.shieldColor,
      };
      game.addPlayer(profile);
      clients.set(clientId, { socket });
      send(socket, { type: "welcome", id: clientId });
      return;
    }

    if (!clientId || !clients.has(clientId)) return;

    if (message.type === "input") {
      if (message.id && message.id !== clientId) return;
      const payload = message.input || {};
      game.setInput(clientId, payload);
    }
  });

  socket.on("close", () => {
    if (!clientId || !clients.has(clientId)) return;
    clients.delete(clientId);
    game.removePlayer(clientId);
  });
});

let lastTick = Date.now();
setInterval(() => {
  const now = Date.now();
  const dt = Math.min((now - lastTick) / 1000, 0.05);
  lastTick = now;
  if (clients.size === 0) return;
  game.tick(dt);
  const snapshot = game.snapshot();
  broadcast({ type: "snapshot", snapshot });
}, Math.floor(1000 / TICK_RATE));

server.listen(PORT, () => {
  console.log(`surge-io authoritative server on :${PORT}`);
});
