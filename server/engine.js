const CONFIG = {
  world: { w: 3600, h: 3600 },
  player: {
    baseEnergy: 60,
    baseHealth: 100,
    minRadius: 10,
    radiusScale: 2.4,
    accel: 520,
    maxSpeed: 540,
    drag: 0.92,
  },
  trail: {
    interval: 0.12,
    minDist: 14,
    baseTtl: 8,
    value: 1.4,
    surgeValue: 2.6,
    surgeTtl: 5.2,
    harvestRange: 24,
  },
  motifs: {
    target: 0,
    value: 0,
  },
  pulseShield: {
    range: 95,
    cone: 0.72,
    maxCharge: 300,
    rechargePerSec: 60,
    drainPerSec: 75,
  },
  laserGun: {
    speed: 1040,
    damage: 22,
    energyCost: 7,
    cooldown: 0.14,
    ttl: 1.4,
    knock: 120,
  },
  ammo: {
    max: 16,
    reloadTime: 1.4,
  },
  laserBeam: {
    range: 980,
    width: 20,
    damagePerSec: 92.3,
    energyCostPerSec: 7,
    knock: 90,
  },
  health: {
    regenDelay: 2.4,
    regenPerSec: 7,
    energyScale: 6,
  },
  kill: {
    reward: 0.3,
    window: 3,
  },
  powerup: {
    count: 2,
    interval: 30,
    duration: 8,
  },
  winEnergy: 10000,
  maxEnergyOtherModes: 4000,
  brace: {
    duration: 2.6,
    cooldown: 4.8,
    speedMult: 0.7,
    damageMult: 0,
    knockMult: 0,
    waveDamageMult: 0,
    waveKnockMult: 0,
  },
  surge: {
    duration: 4,
    cooldown: 3.5,
    speedMult: 1.65,
  },
  tempo: {
    duration: 6,
    trailMult: 1.4,
    pulseMult: 1.3,
    speedMult: 1.12,
  },
  relays: {
    count: 9,
    respawn: 9,
  },
  energyGainMinSpeed: 4,
  streamBoost: {
    duration: 5,
    cooldown: 15,
    mult: 2,
  },
  hit: {
    ttl: 0.45,
  },
  wave: {
    interval: 18,
    speed: 420,
    width: 90,
    damage: 81.7,
    knock: 220,
  },
  deathEffect: {
    duration: 0.9,
    shardCount: 14,
    shardSpeed: 260,
    ringSpeed: 320,
  },
  playerSpawnSafeRadius: 520,
  botSpawnSafeRadius: 420,
};

const MAX_PLAYERS = 15;
const BULLET_GRID = {
  size: 240,
  range: 2,
};

const palette = [
  "#72e6ff",
  "#ff9f7a",
  "#a6ff9c",
  "#ffd06b",
  "#b69cff",
  "#ff8fd8",
];
const TRAILS_ENABLED = false;
const SKINS = [
  { id: "custom", type: "color", accent: palette[0] },
  { id: "darkVoid", type: "image", accent: "#b69cff" },
  { id: "galexyMatter", type: "image", accent: "#72e6ff" },
  { id: "bioVoid", type: "image", accent: "#7affc7" },
  { id: "arcReactor", type: "image", accent: "#7ad6ff" },
  { id: "fusionNexus", type: "image", accent: "#8fd2ff" },
  { id: "skin5", type: "image", accent: "#ff9f7a" },
];

const BOT_DIFFICULTY = {
  normal: "normal",
};

const BOT_TUNING = {
  [BOT_DIFFICULTY.normal]: {
    id: BOT_DIFFICULTY.normal,
    speedMult: 1,
    maxSpeedMult: 1,
    reactionMult: 1,
    aimJitterMult: 1,
    aggroMult: 1,
    threatRangeMult: 1,
    shootRangeMult: 1,
    rushChanceMult: 1,
    braceDistMult: 1,
    braceHealthMult: 1,
    braceTimeMult: 1,
    fleeHealthMult: 1,
    shieldStartFrac: 0.28,
    shieldStopFrac: 0.12,
    shieldHoldMult: 1,
    shieldRestMult: 1,
    streamChanceMult: 1,
  },
};

const zones = [
  {
    type: "core",
    shape: "circle",
    x: CONFIG.world.w / 2,
    y: CONFIG.world.h / 2,
    r: 360,
    bonus: 1.8,
    hazard: 3,
  },
  {
    type: "stream",
    shape: "rect",
    x: 350,
    y: 600,
    w: 1300,
    h: 420,
    dir: { x: 1, y: 0 },
    current: 120,
    trailTtl: 10,
  },
  {
    type: "stream",
    shape: "rect",
    x: 2300,
    y: 2100,
    w: 420,
    h: 1200,
    dir: { x: 0, y: -1 },
    current: 120,
    trailTtl: 10,
  },
  {
    type: "bramble",
    shape: "circle",
    x: 2920,
    y: 860,
    r: 480,
    hazard: 4,
    trailTtl: 4.5,
  },
  {
    type: "glimmer",
    shape: "circle",
    x: 840,
    y: 2680,
    r: 540,
    regen: 6,
    trailTtl: 12,
  },
];

const streamZones = zones.filter((zone) => zone.type === "stream");

const botNames = [
  "Aiden",
  "Alyssa",
  "Amelia",
  "Andre",
  "Aria",
  "Ava",
  "Ben",
  "Brandon",
  "Brianna",
  "Brooke",
  "Caleb",
  "Cameron",
  "Carson",
  "Carter",
  "Chloe",
  "Chris",
  "Daniel",
  "David",
  "Dylan",
  "Elena",
  "Ella",
  "Emily",
  "Emma",
  "Ethan",
  "Evan",
  "Grace",
  "Hannah",
  "Harper",
  "Hayden",
  "Isabella",
  "Jack",
  "Jackson",
  "Jacob",
  "James",
  "Jason",
  "Jenna",
  "Jordan",
  "Joseph",
  "Joshua",
  "Julia",
  "Justin",
  "Kayla",
  "Kennedy",
  "Kevin",
  "Kyle",
  "Lauren",
  "Liam",
  "Logan",
  "Lucas",
  "Maddie",
  "Madison",
  "Maya",
  "Megan",
  "Mia",
  "Molly",
  "Nate",
  "Noah",
  "Olivia",
  "Owen",
  "Paige",
  "Parker",
  "Quinn",
  "Rachel",
  "Riley",
  "Ryan",
  "Samantha",
  "Sarah",
  "Savannah",
  "Sean",
  "Seth",
  "Sophia",
  "Spencer",
  "Taylor",
  "Trevor",
  "Tyler",
  "Victoria",
  "Wesley",
  "Will",
  "William",
  "Zoe",
  "Zach",
  "Addison",
  "Alex",
  "Ashley",
  "Blake",
  "Brody",
  "Claire",
  "Cora",
  "Damian",
  "Derek",
  "Elijah",
  "Ellie",
  "Gabriel",
  "Gavin",
  "Hailey",
  "Leah",
  "Lily",
  "Marcus",
  "Mason",
  "Natalie",
  "Nora",
  "Wyatt",
  "Zane",
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function normalize(x, y) {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

function gridKey(x, y, size) {
  return `${Math.floor(x / size)}:${Math.floor(y / size)}`;
}

function buildPlayerGrid(players, cellSize) {
  const grid = new Map();
  for (const player of players) {
    const key = gridKey(player.x, player.y, cellSize);
    const bucket = grid.get(key);
    if (bucket) {
      bucket.push(player);
    } else {
      grid.set(key, [player]);
    }
  }
  return grid;
}

function canGainEnergy(player) {
  return Math.hypot(player.vx, player.vy) > CONFIG.energyGainMinSpeed;
}

function getEnergyGainMult(player) {
  return player.streamBoostTime > 0 ? CONFIG.streamBoost.mult : 1;
}

function getEnergyBoost(energy) {
  return 1 + Math.min(Math.sqrt(energy) * 0.01, 0.6);
}

function getMaxHealth(energy) {
  const scaled = CONFIG.player.baseHealth + Math.sqrt(Math.max(0, energy)) * CONFIG.health.energyScale;
  return Math.min(300, scaled);
}

function getShieldRange(player) {
  return Math.max(CONFIG.pulseShield.range, player.radius * 1.6);
}

function zoneAt(x, y) {
  for (const zone of zones) {
    if (zone.shape === "circle") {
      const dx = x - zone.x;
      const dy = y - zone.y;
      if (dx * dx + dy * dy <= zone.r * zone.r) return zone;
    } else if (zone.shape === "rect") {
      if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
        return zone;
      }
    }
  }
  return null;
}

function makeColorSkin(color) {
  return { id: "custom", type: "color", color, accent: color };
}

function getSkinById(id) {
  return SKINS.find((skin) => skin.id === id) || null;
}

function makeSkinFromProfile(profile) {
  const skinId = profile && profile.skinId;
  if (skinId === "custom") {
    const color = profile && profile.skinColor ? profile.skinColor : palette[0];
    return makeColorSkin(color);
  }
  if (skinId) {
    const skin = getSkinById(skinId);
    if (skin && skin.type === "image") {
      return { id: skin.id, type: "image", accent: skin.accent || palette[0] };
    }
  }
  const fallback = profile && profile.skinColor ? profile.skinColor : palette[0];
  return makeColorSkin(fallback);
}

function getRandomBotName() {
  return botNames[Math.floor(Math.random() * botNames.length)];
}

function getRandomBotSkin() {
  const imageSkins = SKINS.filter((skin) => skin.type === "image");
  if (imageSkins.length) {
    const skin = imageSkins[Math.floor(Math.random() * imageSkins.length)];
    return { id: skin.id, type: "image", accent: skin.accent || palette[0] };
  }
  const color = palette[Math.floor(Math.random() * palette.length)];
  return makeColorSkin(color);
}

function findSpawnPoint(avoid = null, minDist = CONFIG.botSpawnSafeRadius) {
  const avoidList = Array.isArray(avoid) ? avoid : avoid ? [avoid] : [];
  const hasTargets = avoidList.some((target) => target && target.health > 0);
  const area = {
    minX: 200,
    maxX: CONFIG.world.w - 200,
    minY: 200,
    maxY: CONFIG.world.h - 200,
  };
  let best = null;
  let bestDist = -1;
  let tries = 0;
  while (tries < 40) {
    const x = randRange(area.minX, area.maxX);
    const y = randRange(area.minY, area.maxY);
    if (zoneAt(x, y)) {
      tries += 1;
      continue;
    }
    if (!hasTargets) return { x, y };
    let nearest = Infinity;
    for (const target of avoidList) {
      if (!target || target.health <= 0) continue;
      const d = Math.hypot(x - target.x, y - target.y);
      if (d < nearest) nearest = d;
    }
    if (nearest >= minDist) return { x, y };
    if (nearest > bestDist) {
      bestDist = nearest;
      best = { x, y };
    }
    tries += 1;
  }
  if (best) return best;
  return {
    x: randRange(area.minX, area.maxX),
    y: randRange(area.minY, area.maxY),
  };
}

function assignSpawn(state, player) {
  const avoidList = state.players.filter((other) => other !== player && other.health > 0);
  const minDist = player.isBot ? CONFIG.botSpawnSafeRadius : CONFIG.playerSpawnSafeRadius;
  const spawn = findSpawnPoint(avoidList, minDist);
  player.x = spawn.x;
  player.y = spawn.y;
  player.lastTrail.x = spawn.x;
  player.lastTrail.y = spawn.y;
}

function randomPointInZone(zone) {
  if (zone.shape === "circle") {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (zone.r - 50);
    return { x: zone.x + Math.cos(angle) * radius, y: zone.y + Math.sin(angle) * radius };
  }
  return {
    x: randRange(zone.x + 40, zone.x + zone.w - 40),
    y: randRange(zone.y + 40, zone.y + zone.h - 40),
  };
}

function spawnRelay(state, relay) {
  const candidates = zones.filter((zone) => zone.type !== "stream");
  const zone = candidates[Math.floor(Math.random() * candidates.length)];
  const pos = randomPointInZone(zone);
  relay.x = pos.x;
  relay.y = pos.y;
  relay.active = true;
}

function spawnMotif(state) {
  const core = zones[0];
  const spawnCore = Math.random() < 0.4;
  let x = 0;
  let y = 0;
  if (spawnCore) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (core.r - 40);
    x = core.x + Math.cos(angle) * radius;
    y = core.y + Math.sin(angle) * radius;
  } else {
    x = randRange(80, CONFIG.world.w - 80);
    y = randRange(80, CONFIG.world.h - 80);
  }
  state.motifs.push({ x, y, value: CONFIG.motifs.value });
}

function spawnPowerup(state) {
  const candidates = zones.filter((zone) => zone.type !== "stream");
  const zone = candidates[Math.floor(Math.random() * candidates.length)];
  const pos = randomPointInZone(zone);
  state.powerups.push({ x: pos.x, y: pos.y });
}

function recordHit(state, target, attacker) {
  if (!attacker) return;
  target.lastHitBy = attacker.id;
  target.lastHitTime = state.gameTime;
}

function recordDamage(state, target) {
  target.lastDamageTime = state.gameTime;
}

function applyDamage(state, target, amount, attacker = null) {
  if (target.bracing) return false;
  target.health -= amount;
  recordDamage(state, target);
  if (attacker) {
    recordHit(state, target, attacker);
  }
  return true;
}

function applyInput(player, dt) {
  const input = player.input || {};
  let ax = typeof input.moveX === "number" ? input.moveX : 0;
  let ay = typeof input.moveY === "number" ? input.moveY : 0;
  let mag = Math.hypot(ax, ay);
  if (mag > 1) {
    ax /= mag;
    ay /= mag;
    mag = 1;
  }
  const dir = mag ? { x: ax / mag, y: ay / mag } : { x: 0, y: 0 };
  player.braceRequest = Boolean(input.bracing);
  player.rushRequest = Boolean(input.rush);

  if (typeof input.aimX === "number" && typeof input.aimY === "number") {
    player.aim = normalize(input.aimX, input.aimY);
  }
  player.shooting = Boolean(input.shooting && player.energy > 2);
  player.firing = Boolean(input.firing && player.energy > 2);

  const mass = 1 + player.energy * 0.00005;
  const energyBoost = getEnergyBoost(player.energy);
  const rushMult = player.rushActive ? CONFIG.surge.speedMult : 1;
  const tempoMult = player.tempoTime > 0 ? CONFIG.tempo.speedMult : 1;
  const braceActive =
    player.braceRequest && player.braceCooldown <= 0 && player.braceTime > 0;
  const braceMult = braceActive ? CONFIG.brace.speedMult : 1;
  const accel = (CONFIG.player.accel * energyBoost * rushMult * tempoMult * braceMult) / mass;
  player.vx += dir.x * accel * dt * mag;
  player.vy += dir.y * accel * dt * mag;
}

function applyAI(state, player, dt) {
  const maxHealth = getMaxHealth(player.energy);
  const healthRatio = player.health / maxHealth;
  const hillMode = false;
  const tuning = player.botTuning || BOT_TUNING[BOT_DIFFICULTY.normal];
  const speedMult = tuning.speedMult;
  const reactionMult = tuning.reactionMult;
  const aimJitterMult = tuning.aimJitterMult;
  const aggroMult = tuning.aggroMult;
  const threatRangeMult = tuning.threatRangeMult;
  const shootRangeMult = tuning.shootRangeMult;
  const rushChanceMult = tuning.rushChanceMult;
  const braceDistMult = tuning.braceDistMult;
  const braceHealthMult = tuning.braceHealthMult;
  const braceTimeMult = tuning.braceTimeMult;
  const fleeHealthMult = tuning.fleeHealthMult;
  const shieldStartFrac = tuning.shieldStartFrac;
  const shieldStopFrac = tuning.shieldStopFrac;
  const shieldHoldMult = tuning.shieldHoldMult;
  const shieldRestMult = tuning.shieldRestMult;
  const streamChanceMult = tuning.streamChanceMult;

  if (player.ai.aimTimer <= 0) {
    player.ai.aimTimer = randRange(0.2, 0.5) * reactionMult;
    const jitterRange = (hillMode ? 0.2 : 0.26) * aimJitterMult;
    player.ai.aimJitter = randRange(-jitterRange, jitterRange);
  } else {
    player.ai.aimTimer -= dt;
  }

  let threat = null;
  let threatDist = Infinity;
  for (const other of state.players) {
    if (other === player) continue;
    const d = dist(other, player);
    if (d < threatDist) {
      threatDist = d;
      threat = other;
    }
  }

  if (player.ai.fire <= 0) {
    player.ai.fire = randRange(0.2, 0.5) * reactionMult;
    player.ai.fireMode = Math.random() < 0.6 * aggroMult;
  } else {
    player.ai.fire -= dt;
  }

  if (player.ai.retarget <= 0 || !player.ai.target) {
    player.ai.retarget = randRange(0.6, 1.6) * reactionMult;
    if (threat && threatDist < 960 * threatRangeMult && Math.random() < 0.8) {
      player.ai.target = { x: threat.x, y: threat.y };
    } else {
      player.ai.target = {
        x: randRange(200, CONFIG.world.w - 200),
        y: randRange(200, CONFIG.world.h - 200),
      };
    }
  } else {
    player.ai.retarget -= dt;
  }

  let dir = normalize(player.ai.target.x - player.x, player.ai.target.y - player.y);
  const threatPressure = threat && threatDist < 320 * threatRangeMult;
  if (threatPressure) {
    const away = normalize(player.x - threat.x, player.y - threat.y);
    dir = normalize(dir.x + away.x * 1.1, dir.y + away.y * 1.1);
  }

  const zoneHere = zoneAt(player.x, player.y);
  const inStream = zoneHere && zoneHere.type === "stream";
  const wantsStream = !inStream && player.streamCooldown <= 0 && Math.random() < 0.25 * streamChanceMult;
  if (wantsStream) {
    let best = null;
    let bestDist = Infinity;
    for (const zone of streamZones) {
      const zx = zone.shape === "rect" ? zone.x + zone.w / 2 : zone.x;
      const zy = zone.shape === "rect" ? zone.y + zone.h / 2 : zone.y;
      const d = Math.hypot(zx - player.x, zy - player.y);
      if (d < bestDist) {
        best = { x: zx, y: zy };
        bestDist = d;
      }
    }
    if (best) dir = normalize(best.x - player.x, best.y - player.y);
  }

  const energyBoost = getEnergyBoost(player.energy);
  const rushMult = player.rushActive ? CONFIG.surge.speedMult : 1;
  const tempoMult = player.tempoTime > 0 ? CONFIG.tempo.speedMult : 1;
  const braceMult =
    player.braceRequest && player.braceCooldown <= 0 && player.braceTime > 0
      ? CONFIG.brace.speedMult
      : 1;
  const accel = (CONFIG.player.accel * energyBoost * rushMult * tempoMult * braceMult) / (1 + player.energy * 0.00005);
  player.vx += dir.x * accel * dt * speedMult;
  player.vy += dir.y * accel * dt * speedMult;

  if (threat) {
    const aimDir = normalize(threat.x - player.x, threat.y - player.y);
    player.aim = normalize(
      aimDir.x + player.ai.aimJitter,
      aimDir.y + player.ai.aimJitter
    );
    const incomingFire = threat.shooting || threat.firing;
    if (player.ai.braceIntent <= 0) {
      if (
        player.braceCooldown <= 0 &&
        player.braceTime > 0 &&
        (threatDist < 240 * braceDistMult || healthRatio < 0.6 * braceHealthMult)
      ) {
        player.ai.braceIntent = randRange(0.5, 1.4) * braceTimeMult;
      }
    } else {
      player.ai.braceIntent -= dt;
    }
    player.braceRequest = player.ai.braceIntent > 0;

    if (player.ai.shieldRest > 0) {
      player.ai.shieldRest -= dt;
    } else if (
      player.ai.shieldIntent <= 0 &&
      player.shieldCharge > CONFIG.pulseShield.maxCharge * shieldStartFrac &&
      (incomingFire || threatPressure)
    ) {
      player.ai.shieldIntent = randRange(0.25, 0.65) * shieldHoldMult;
    }
    player.firing = player.ai.shieldIntent > 0 && player.shieldCharge > 0;
    if (player.firing) {
      player.ai.shieldIntent -= dt;
    } else if (player.ai.shieldIntent > 0) {
      player.ai.shieldIntent = 0;
      player.ai.shieldRest = randRange(0.7, 1.6) * shieldRestMult;
    }

    if (player.laserTime > 0) {
      player.shooting = true;
    } else {
      const canShoot =
        player.energy > CONFIG.laserGun.energyCost + 2 && player.ammo > 0 && !player.reloading;
      const shootRange = (hillMode ? 800 : 720) * shootRangeMult;
      player.shooting = canShoot && threatDist < shootRange && player.ai.fireMode;
    }
  } else {
    player.ai.shieldIntent = 0;
    player.firing = false;
    player.shooting = false;
  }

  if (!player.rushActive && player.surgeCooldown <= 0 && Math.random() < 0.02 * rushChanceMult) {
    player.rushRequest = true;
  } else {
    player.rushRequest = false;
  }

  if (player.isBot) {
    const shieldActive = player.firing && player.shieldCharge > 0;
    if (shieldActive && threat) {
      const aimDir = normalize(threat.x - player.x, threat.y - player.y);
      if (!player.shieldAim) player.shieldAim = { ...aimDir };
      const blend = 0.22;
      const ax = player.shieldAim.x + (aimDir.x - player.shieldAim.x) * blend;
      const ay = player.shieldAim.y + (aimDir.y - player.shieldAim.y) * blend;
      player.shieldAim = normalize(ax, ay);
      player.aim = player.shieldAim;
    }
  }
}

function tryFireGun(state, player) {
  if (player.gunCooldown > 0) return;
  if (player.energy < CONFIG.laserGun.energyCost) return;
  if (player.reloading || player.ammo <= 0) return;
  player.energy -= CONFIG.laserGun.energyCost;
  player.gunCooldown = CONFIG.laserGun.cooldown;
  player.ammo -= 1;
  player.shotsFired += 1;

  const spread = player.tempoTime > 0 ? 0.02 : 0.04;
  const baseAngle = Math.atan2(player.aim.y, player.aim.x);
  const angle = baseAngle + randRange(-spread, spread);
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  const startX = player.x + dir.x * (player.radius + 6);
  const startY = player.y + dir.y * (player.radius + 6);

  state.bullets.push({
    x: startX,
    y: startY,
    vx: dir.x * CONFIG.laserGun.speed + player.vx * 0.25,
    vy: dir.y * CONFIG.laserGun.speed + player.vy * 0.25,
    ttl: CONFIG.laserGun.ttl,
    ownerId: player.id,
    color: player.color,
  });

  player.vx -= dir.x * 22;
  player.vy -= dir.y * 22;
}

function updatePlayer(state, player, dt) {
  if (player.isBot) {
    applyAI(state, player, dt);
  } else {
    applyInput(player, dt);
  }

  if (player.surgeCooldown > 0) player.surgeCooldown -= dt;
  if (player.tempoTime > 0) player.tempoTime -= dt;
  if (player.gunCooldown > 0) player.gunCooldown -= dt;
  if (player.laserTime > 0) player.laserTime -= dt;
  if (player.reloadTime > 0) player.reloadTime -= dt;
  if (player.braceCooldown > 0) player.braceCooldown -= dt;
  if (player.braceCooldown <= 0 && player.braceTime <= 0) {
    player.braceTime = CONFIG.brace.duration;
  }
  if (player.streamCooldown > 0 && player.streamBoostTime <= 0) {
    player.streamCooldown -= dt;
  }
  if (player.streamBoostTime > 0) {
    player.streamBoostTime -= dt;
    if (player.streamBoostTime <= 0) {
      player.streamBoostTime = 0;
      player.streamCooldown = CONFIG.streamBoost.cooldown;
    }
  }

  if (player.braceRequest && player.braceCooldown <= 0 && player.braceTime > 0) {
    player.bracing = true;
    player.braceTime -= dt;
    if (player.braceTime <= 0) {
      player.braceTime = 0;
      player.bracing = false;
      player.braceCooldown = CONFIG.brace.cooldown;
    }
  } else {
    player.bracing = false;
  }

  if (player.reloadTime <= 0 && player.reloading) {
    player.reloading = false;
    player.ammo = CONFIG.ammo.max;
  }

  if (player.input && player.input.reload && !player.reloading && player.ammo < CONFIG.ammo.max) {
    player.reloading = true;
    player.reloadTime = CONFIG.ammo.reloadTime;
  }

  const wasShieldActive = player.shieldActive;
  player.shieldActive = player.firing && player.shieldCharge > 0;
  if (player.shieldActive) {
    player.shieldCharge = Math.max(
      0,
      player.shieldCharge - CONFIG.pulseShield.drainPerSec * dt
    );
    if (player.shieldCharge <= 0) player.shieldActive = false;
  } else if (!player.firing) {
    player.shieldCharge = Math.min(
      CONFIG.pulseShield.maxCharge,
      player.shieldCharge + CONFIG.pulseShield.rechargePerSec * dt
    );
  }

  if (player.rushActive) {
    player.surgeTime -= dt;
    if (player.surgeTime <= 0) {
      player.surgeTime = 0;
      player.rushActive = false;
      player.surgeCooldown = CONFIG.surge.cooldown;
    }
  }

  if (!player.rushActive && player.rushRequest && player.surgeCooldown <= 0) {
    player.surgeTime = CONFIG.surge.duration;
    player.rushActive = true;
  }

  if (player.shooting && player.laserTime <= 0) tryFireGun(state, player);

  const zone = zoneAt(player.x, player.y);
  const inStream = zone && zone.type === "stream";
  if (inStream && player.streamCooldown <= 0 && player.streamBoostTime <= 0) {
    player.streamBoostTime = CONFIG.streamBoost.duration;
  }
  player.inStream = Boolean(inStream);

  if (zone) {
    if (zone.type === "stream") {
      player.vx += zone.dir.x * zone.current * dt;
      player.vy += zone.dir.y * zone.current * dt;
    }
    if (zone.hazard) {
      applyDamage(state, player, zone.hazard * dt * 2.03);
    }
    if (zone.regen) {
      player.health += zone.regen * dt;
    }
  }

  const speed = Math.hypot(player.vx, player.vy);
  const speedMult =
    (player.rushActive ? CONFIG.surge.speedMult : 1) *
    (player.tempoTime > 0 ? CONFIG.tempo.speedMult : 1);
  const energySpeed = 1 + Math.min(Math.sqrt(player.energy) * 0.008, 0.8);
  const botMaxSpeedMult = player.isBot && player.botTuning ? player.botTuning.maxSpeedMult : 1;
  const maxSpeed = CONFIG.player.maxSpeed * speedMult * energySpeed * botMaxSpeedMult;
  if (speed > maxSpeed) {
    const s = maxSpeed / speed;
    player.vx *= s;
    player.vy *= s;
  }

  const frameScale = dt * 60;
  const drag = Math.pow(CONFIG.player.drag, frameScale);
  player.vx *= drag;
  player.vy *= drag;

  if (player.bracing) {
    const braceDrag = Math.pow(0.9, frameScale);
    player.vx *= braceDrag;
    player.vy *= braceDrag;
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;

  if (player.x < 0 || player.x > CONFIG.world.w || player.y < 0 || player.y > CONFIG.world.h) {
    player.x = clamp(player.x, 0, CONFIG.world.w);
    player.y = clamp(player.y, 0, CONFIG.world.h);
    player.vx *= -0.4;
    player.vy *= -0.4;
  }

  player.trailTimer += dt;
  const moved = Math.hypot(player.x - player.lastTrail.x, player.y - player.lastTrail.y);
  if (TRAILS_ENABLED && (player.trailTimer >= CONFIG.trail.interval || moved > CONFIG.trail.minDist)) {
    player.trailTimer = 0;
    player.lastTrail.x = player.x;
    player.lastTrail.y = player.y;
    const zoneHere = zoneAt(player.x, player.y);
    const tempoMult = player.tempoTime > 0 ? CONFIG.tempo.trailMult : 1;
    const surgeHot = false;
    const ttlBase = zoneHere && zoneHere.trailTtl ? zoneHere.trailTtl : CONFIG.trail.baseTtl;
    const ttl = surgeHot ? Math.min(ttlBase, CONFIG.trail.surgeTtl) : ttlBase;
    state.trailSegments.push({
      x: player.x,
      y: player.y,
      ownerId: player.id,
      ttl,
      ttlMax: ttl,
      value: CONFIG.trail.value * tempoMult * (surgeHot ? CONFIG.trail.surgeValue : 1),
      hot: surgeHot,
    });
  }

  player.radius =
    CONFIG.player.minRadius +
    Math.sqrt(player.energy) * CONFIG.player.radiusScale +
    Math.log(player.energy + 1) * 1.6;
  player.energy = Math.max(0, player.energy);
  const maxHealth = getMaxHealth(player.energy);
  if (state.gameTime - player.lastDamageTime > CONFIG.health.regenDelay) {
    player.health += CONFIG.health.regenPerSec * dt;
  }
  player.health = clamp(player.health, 0, maxHealth);

  if (player.comboTimer > 0) {
    player.comboTimer -= dt;
    if (player.comboTimer <= 0) player.combo = Math.max(0, player.combo - 2);
  }

  player.aliveTime += dt;
  player.score = Math.round(
    player.energy +
      player.steals * 8 +
      player.combo * 2 +
      player.kills * 20 +
      player.aliveTime * 0.05
  );
}

function updateWave(state, dt) {
  state.wave.timer -= dt;
  if (state.wave.timer <= 0 && !state.wave.active) {
    state.wave.active = true;
    state.wave.radius = 0;
    state.wave.timer = CONFIG.wave.interval;
  }

  if (!state.wave.active) return;
  state.wave.radius += CONFIG.wave.speed * dt;
  const maxR = Math.hypot(CONFIG.world.w, CONFIG.world.h);
  if (state.wave.radius > maxR + CONFIG.wave.width) {
    state.wave.active = false;
  }

  for (const player of state.players) {
    const dx = player.x - state.wave.origin.x;
    const dy = player.y - state.wave.origin.y;
    const d = Math.hypot(dx, dy);
    if (Math.abs(d - state.wave.radius) < CONFIG.wave.width) {
      if (player.bracing) continue;
      const dir = normalize(dx, dy);
      player.vx += dir.x * CONFIG.wave.knock * dt;
      player.vy += dir.y * CONFIG.wave.knock * dt;
      applyDamage(state, player, CONFIG.wave.damage * dt);
    }
  }
}

function updateBullets(state, dt) {
  if (state.bullets.length === 0) return;
  const playerById = new Map();
  for (const player of state.players) {
    playerById.set(player.id, player);
  }
  const grid = buildPlayerGrid(state.players, BULLET_GRID.size);
  const range = BULLET_GRID.range;
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const bullet = state.bullets[i];
    bullet.ttl -= dt;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    const owner = playerById.get(bullet.ownerId) || null;

    if (
      bullet.ttl <= 0 ||
      bullet.x < -50 ||
      bullet.y < -50 ||
      bullet.x > CONFIG.world.w + 50 ||
      bullet.y > CONFIG.world.h + 50
    ) {
      state.bullets.splice(i, 1);
      continue;
    }

    const cellX = Math.floor(bullet.x / BULLET_GRID.size);
    const cellY = Math.floor(bullet.y / BULLET_GRID.size);
    let removed = false;

    for (let gx = cellX - range; gx <= cellX + range; gx++) {
      for (let gy = cellY - range; gy <= cellY + range; gy++) {
        const bucket = grid.get(`${gx}:${gy}`);
        if (!bucket) continue;
        for (const target of bucket) {
          if (target.id === bullet.ownerId) continue;
          if (target.shieldActive) {
            const sx = bullet.x - target.x;
            const sy = bullet.y - target.y;
            const dist = Math.hypot(sx, sy);
            const shieldRange = getShieldRange(target);
            if (dist < shieldRange) {
              const dir = normalize(sx, sy);
              const dot = dir.x * target.aim.x + dir.y * target.aim.y;
              if (dot > Math.cos(CONFIG.pulseShield.cone)) {
                const damage = CONFIG.laserGun.damage;
                const absorbed = Math.min(target.shieldCharge, damage);
                target.shieldCharge = Math.max(0, target.shieldCharge - absorbed);
                if (target.shieldCharge <= 0) target.shieldActive = false;
                if (absorbed < damage) {
                  applyDamage(state, target, damage - absorbed, owner);
                }
                state.bullets.splice(i, 1);
                removed = true;
                break;
              }
            }
          }
          const dx = target.x - bullet.x;
          const dy = target.y - bullet.y;
          const hitRadius = target.radius + 4;
          if (dx * dx + dy * dy <= hitRadius * hitRadius) {
            if (target.bracing) {
              state.bullets.splice(i, 1);
              removed = true;
              break;
            }
            const damage = CONFIG.laserGun.damage;
            if (owner) owner.shotsHit += 1;
            applyDamage(state, target, damage, owner);
            target.vx += (bullet.vx / CONFIG.laserGun.speed) * CONFIG.laserGun.knock;
            target.vy += (bullet.vy / CONFIG.laserGun.speed) * CONFIG.laserGun.knock;
            state.bullets.splice(i, 1);
            removed = true;
            break;
          }
        }
        if (removed) break;
      }
      if (removed) break;
    }
  }
}

function updateLaserBeam(state, dt) {
  for (const attacker of state.players) {
    if (!attacker.shooting || attacker.laserTime <= 0) continue;
    attacker.energy -= CONFIG.laserBeam.energyCostPerSec * dt;
    if (attacker.energy <= 0) continue;

    const ax = attacker.x;
    const ay = attacker.y;
    const dir = attacker.aim;
    for (const target of state.players) {
      if (target === attacker) continue;
      const rx = target.x - ax;
      const ry = target.y - ay;
      const proj = rx * dir.x + ry * dir.y;
      if (proj < 0 || proj > CONFIG.laserBeam.range) continue;
      const px = rx - dir.x * proj;
      const py = ry - dir.y * proj;
      const perp = Math.hypot(px, py);
      const width = CONFIG.laserBeam.width + target.radius * 0.4;
      if (perp > width) continue;

      const damage = CONFIG.laserBeam.damagePerSec * dt;
      applyDamage(state, target, damage, attacker);
      target.vx += dir.x * CONFIG.laserBeam.knock * dt;
      target.vy += dir.y * CONFIG.laserBeam.knock * dt;
    }
  }
}

function updateMotifs(state, dt) {
  while (state.motifs.length < CONFIG.motifs.target) spawnMotif(state);

  for (let i = state.motifs.length - 1; i >= 0; i--) {
    const motif = state.motifs[i];
    for (const player of state.players) {
      const reach = player.radius + 8;
      const dx = player.x - motif.x;
      const dy = player.y - motif.y;
      if (dx * dx + dy * dy < reach * reach) {
        if (!canGainEnergy(player)) continue;
        const zone = zoneAt(player.x, player.y);
        const bonus = zone && zone.type === "core" ? zone.bonus : 1;
        const gain = motif.value * bonus;
        player.energy += gain;
        player.energyGained += gain;
        state.motifs.splice(i, 1);
        break;
      }
    }
  }
}

function updatePowerups(state, dt) {
  state.powerupTimer -= dt;
  if (state.powerupTimer <= 0) {
    while (state.powerups.length < CONFIG.powerup.count) spawnPowerup(state);
    state.powerupTimer = CONFIG.powerup.interval;
  }

  for (let i = state.powerups.length - 1; i >= 0; i--) {
    const powerup = state.powerups[i];
    for (const player of state.players) {
      const dx = player.x - powerup.x;
      const dy = player.y - powerup.y;
      if (dx * dx + dy * dy < (player.radius + 14) * (player.radius + 14)) {
        player.laserTime = CONFIG.powerup.duration;
        state.powerups.splice(i, 1);
        break;
      }
    }
  }
}

function updateTrails(state, dt) {
  if (!TRAILS_ENABLED) {
    state.trailSegments.length = 0;
    return;
  }
  for (let i = state.trailSegments.length - 1; i >= 0; i--) {
    const seg = state.trailSegments[i];
    seg.ttl -= dt;
    if (seg.ttl <= 0) {
      state.trailSegments.splice(i, 1);
      continue;
    }

    for (const player of state.players) {
      const dx = player.x - seg.x;
      const dy = player.y - seg.y;
      if (dx * dx + dy * dy < CONFIG.trail.harvestRange * CONFIG.trail.harvestRange) {
        if (!canGainEnergy(player)) continue;
        const owner = state.players.find((p) => p.id === seg.ownerId);
        if (seg.ownerId === player.id) {
          const gain = seg.value * (1 + player.combo * 0.05) * getEnergyGainMult(player);
          player.energy += gain;
          player.energyGained += gain;
          player.combo = clamp(player.combo + 1, 0, 30);
          player.comboTimer = 2.2;
        } else {
          const gain = seg.value * 0.8 * getEnergyGainMult(player);
          player.energy += gain;
          player.energyGained += gain;
          player.steals += 1;
          if (owner) owner.energy = Math.max(0, owner.energy - seg.value * 0.5);
        }
        state.trailSegments.splice(i, 1);
        break;
      }
    }
  }
}

function updateRelays(state, dt) {
  for (const relay of state.relays) {
    if (!relay.active) {
      relay.respawn -= dt;
      if (relay.respawn <= 0) spawnRelay(state, relay);
      continue;
    }
    for (const player of state.players) {
      const dx = player.x - relay.x;
      const dy = player.y - relay.y;
      if (dx * dx + dy * dy < 28 * 28) {
        player.tempoTime = CONFIG.tempo.duration;
        relay.active = false;
        relay.respawn = CONFIG.relays.respawn;
        break;
      }
    }
  }
}

function respawn(state, player) {
  assignSpawn(state, player);
  player.vx = 0;
  player.vy = 0;
  player.energy = CONFIG.player.baseEnergy;
  player.health = getMaxHealth(player.energy);
  player.maxEnergy = CONFIG.player.baseEnergy;
  player.combo = 0;
  player.comboTimer = 0;
  player.steals = 0;
  player.aliveTime = 0;
  player.killStreak = 0;
  player.firing = false;
  player.shooting = false;
  player.bracing = false;
  player.braceRequest = false;
  player.braceTime = CONFIG.brace.duration;
  player.braceCooldown = 0;
  player.surgeTime = 0;
  player.surgeCooldown = 0;
  player.rushRequest = false;
  player.rushActive = false;
  player.tempoTime = 0;
  player.gunCooldown = 0;
  player.shieldCharge = CONFIG.pulseShield.maxCharge;
  player.shieldActive = false;
  player.shieldAim = null;
  player.shieldTargetId = null;
  player.streamBoostTime = 0;
  player.streamCooldown = 0;
  player.inStream = false;
  player.ammo = CONFIG.ammo.max;
  player.reloading = false;
  player.reloadTime = 0;
  player.lastHitBy = null;
  player.lastHitTime = -100;
  player.lastDamageTime = -100;
  player.laserTime = 0;
  if (player.ai) {
    player.ai.retarget = 0;
    player.ai.fire = 0;
    player.ai.fireMode = false;
    player.ai.braceIntent = 0;
    player.ai.shieldIntent = 0;
    player.ai.shieldRest = 0;
    player.ai.aimTimer = 0;
    player.ai.aimJitter = 0;
    player.ai.target = { x: randRange(0, CONFIG.world.w), y: randRange(0, CONFIG.world.h) };
  }
}

function createPlayer(name, isBot, skin, shieldColor) {
  const appliedSkin = skin || makeColorSkin(palette[0]);
  const accent = appliedSkin.accent || appliedSkin.color || palette[0];
  const color = appliedSkin.type === "color" ? appliedSkin.color || accent : accent;
  const handShield = shieldColor || accent || color;
  const player = {
    id: `${name}-${Math.floor(Math.random() * 100000)}`,
    name,
    isBot,
    team: null,
    botTuning: isBot ? BOT_TUNING[BOT_DIFFICULTY.normal] : null,
    color,
    skin: { ...appliedSkin, color, accent },
    handShieldColor: handShield,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    energy: CONFIG.player.baseEnergy,
    health: getMaxHealth(CONFIG.player.baseEnergy),
    radius: CONFIG.player.minRadius,
    maxEnergy: CONFIG.player.baseEnergy,
    trailTimer: 0,
    lastTrail: { x: 0, y: 0 },
    combo: 0,
    comboTimer: 0,
    steals: 0,
    energyGained: 0,
    score: 0,
    aliveTime: 0,
    firing: false,
    shooting: false,
    aim: { x: 1, y: 0 },
    bracing: false,
    braceRequest: false,
    braceTime: CONFIG.brace.duration,
    braceCooldown: 0,
    surgeTime: 0,
    surgeCooldown: 0,
    rushRequest: false,
    rushActive: false,
    tempoTime: 0,
    gunCooldown: 0,
    shieldCharge: CONFIG.pulseShield.maxCharge,
    shieldActive: false,
    streamBoostTime: 0,
    streamCooldown: 0,
    inStream: false,
    shieldAim: null,
    shieldTargetId: null,
    ammo: CONFIG.ammo.max,
    reloadTime: 0,
    reloading: false,
    kills: 0,
    deaths: 0,
    killStreak: 0,
    maxKillStreak: 0,
    shotsFired: 0,
    shotsHit: 0,
    lastHitBy: null,
    lastHitTime: -100,
    lastDamageTime: -100,
    laserTime: 0,
    input: null,
    ai: isBot
      ? {
          target: { x: randRange(0, CONFIG.world.w), y: randRange(0, CONFIG.world.h) },
          retarget: 0,
          fire: 0,
          fireMode: false,
          braceIntent: 0,
          shieldIntent: 0,
          shieldRest: 0,
          aimTimer: 0,
          aimJitter: 0,
        }
      : null,
  };
  player.lastTrail.x = player.x;
  player.lastTrail.y = player.y;
  return player;
}

function initWorld(state) {
  state.trailSegments.length = 0;
  state.motifs.length = 0;
  state.relays.length = 0;
  state.bullets.length = 0;
  state.powerups.length = 0;
  state.gameTime = 0;
  for (let i = 0; i < CONFIG.relays.count; i++) {
    const relay = { x: 0, y: 0, active: true, respawn: 0 };
    spawnRelay(state, relay);
    state.relays.push(relay);
  }
  state.wave.timer = CONFIG.wave.interval;
  state.wave.active = false;
  state.wave.radius = 0;
  state.powerupTimer = CONFIG.powerup.interval;
}

function syncBots(state) {
  const humans = state.players.filter((player) => !player.isBot).length;
  const botLimit = Math.max(0, MAX_PLAYERS - humans);
  while (state.players.filter((player) => player.isBot).length > botLimit) {
    const index = state.players.findIndex((player) => player.isBot);
    if (index < 0) break;
    state.players.splice(index, 1);
  }
  while (state.players.filter((player) => player.isBot).length < botLimit) {
    const bot = createPlayer(getRandomBotName(), true, getRandomBotSkin(), null);
    assignSpawn(state, bot);
    state.players.push(bot);
  }
}

function update(state, dt) {
  state.gameTime += dt;
  syncBots(state);

  for (const player of state.players) updatePlayer(state, player, dt);
  updateWave(state, dt);
  updateBullets(state, dt);
  updateLaserBeam(state, dt);
  updatePowerups(state, dt);
  updateTrails(state, dt);
  updateRelays(state, dt);
  updateMotifs(state, dt);

  for (const player of state.players) {
    player.maxEnergy = Math.max(player.maxEnergy, player.energy);
  }

  for (const player of state.players) {
    if (player.health <= 0) {
      player.deaths += 1;
      player.killStreak = 0;
      let killerName = "Arena";
      if (player.lastHitBy && state.gameTime - player.lastHitTime <= CONFIG.kill.window) {
        const killer = state.players.find((p) => p.id === player.lastHitBy);
        if (killer) {
          killerName = killer.name;
          const rewardBase = Math.max(0, player.energy);
          if (canGainEnergy(killer)) {
            const rewardGain = rewardBase * CONFIG.kill.reward * getEnergyGainMult(killer);
            killer.energy += rewardGain;
            killer.energyGained += rewardGain;
          }
          killer.kills += 1;
          killer.killStreak += 1;
          killer.maxKillStreak = Math.max(killer.maxKillStreak, killer.killStreak);
          const heal = getMaxHealth(killer.energy) * 0.25;
          killer.health = Math.min(killer.health + heal, getMaxHealth(killer.energy));
        }
      }
      respawn(state, player);
    }
  }
}

function buildSnapshot(state) {
  const players = state.players.map((player) => ({
    player: {
      id: player.id,
      name: player.name,
      skinId: player.skin.id,
      skinColor: player.skin.type === "color" ? player.skin.color : null,
      shieldColor: player.handShieldColor,
      team: null,
    },
    state: {
      x: player.x,
      y: player.y,
      vx: player.vx,
      vy: player.vy,
      energy: player.energy,
      health: player.health,
      radius: player.radius,
      aim: player.aim,
      firing: player.firing,
      shooting: player.shooting,
      bracing: player.bracing,
      shieldCharge: player.shieldCharge,
      shieldActive: player.shieldActive,
      laserTime: player.laserTime,
      ammo: player.ammo,
      reloading: player.reloading,
      kills: player.kills,
      deaths: player.deaths,
      score: player.score,
      rushActive: player.rushActive,
      tempoTime: player.tempoTime,
      surgeTime: player.surgeTime,
      streamBoostTime: player.streamBoostTime,
      inStream: player.inStream,
    },
  }));
  return {
    time: state.gameTime,
    players,
    bullets: state.bullets.map((bullet) => ({ ...bullet })),
    powerups: state.powerups.map((powerup) => ({ ...powerup })),
    relays: state.relays.map((relay) => ({ ...relay })),
    wave: { ...state.wave },
  };
}

function createGame() {
  const state = {
    players: [],
    trailSegments: [],
    motifs: [],
    relays: [],
    bullets: [],
    powerups: [],
    gameTime: 0,
    powerupTimer: CONFIG.powerup.interval,
    wave: {
      timer: CONFIG.wave.interval,
      active: false,
      radius: 0,
      origin: { x: CONFIG.world.w / 2, y: CONFIG.world.h / 2 },
    },
  };

  initWorld(state);

  return {
    state,
    addPlayer(profile) {
      const skin = makeSkinFromProfile(profile || {});
      const player = createPlayer(profile.name || "Pilot", false, skin, profile.shieldColor);
      if (profile.id) player.id = profile.id;
      assignSpawn(state, player);
      state.players.push(player);
      return player;
    },
    removePlayer(id) {
      const index = state.players.findIndex((player) => player.id === id);
      if (index >= 0) state.players.splice(index, 1);
    },
    setInput(id, input) {
      const player = state.players.find((p) => p.id === id);
      if (!player) return;
      player.input = input;
    },
    tick(dt) {
      update(state, dt);
    },
    snapshot() {
      return buildSnapshot(state);
    },
  };
}

module.exports = {
  createGame,
  CONFIG,
  MAX_PLAYERS,
};
