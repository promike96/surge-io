const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = document.getElementById("ui");
const uiStats = document.getElementById("stats");
const uiHints = document.getElementById("hints");
const uiLbList = document.getElementById("lb-list");
const matchTimer = document.getElementById("matchTimer");
const reloadIndicator = document.getElementById("reload-indicator");
const damageVignette = document.getElementById("damage-vignette");
const rushIndicator = document.getElementById("rush-indicator");
const beamIndicator = document.getElementById("beam-indicator");
const streamIndicator = document.getElementById("stream-indicator");
const zoneIndicator = document.getElementById("zone-indicator");
const killCard = document.getElementById("kill-card");
const killPraise = document.getElementById("killPraise");
const crosshair = document.getElementById("crosshair");
const minimap = document.getElementById("minimap");
const minimapCtx = minimap.getContext("2d");
const menu = document.getElementById("menu");
const loadingScreen = document.getElementById("loading");
const menuStatus = document.getElementById("menuStatus");
const menuRoast = document.getElementById("menuRoast");
const menuMeta = document.getElementById("menuMeta");
const endTitle = document.getElementById("endTitle");
const endRoast = document.getElementById("endRoast");
const endMeta = document.getElementById("endMeta");
const endContinue = document.getElementById("endContinue");
const skinBtn = document.getElementById("skinBtn");
const skinMenu = document.getElementById("skinMenu");
const skinClose = document.getElementById("skinClose");
const skinGrid = document.getElementById("skinGrid");
const skinPreview = document.getElementById("skinPreview");
const skinName = document.getElementById("skinName");
const shieldBtn = document.getElementById("shieldBtn");
const shieldMenu = document.getElementById("shieldMenu");
const shieldClose = document.getElementById("shieldClose");
const shieldPreview = document.getElementById("shieldPreview");
const shieldColorInput = document.getElementById("shieldColorInput");
const musicToggle = document.getElementById("musicToggle");
const sfxToggle = document.getElementById("sfxToggle");
const musicVolume = document.getElementById("musicVolume");
const sfxVolume = document.getElementById("sfxVolume");
const nameInput = document.getElementById("nameInput");
const rememberToggle = document.getElementById("rememberToggle");
const colorInput = document.getElementById("colorInput");
const modeSelect = document.getElementById("modeSelect");
const botDifficultySelect = document.getElementById("botDifficultySelect");
const playBtn = document.getElementById("playBtn");
const touchControls = document.getElementById("touch-controls");
const touchMove = document.getElementById("touch-move");
const touchAim = document.getElementById("touch-aim");
const touchRay = document.getElementById("touch-ray");
const touchShield = document.getElementById("touch-shield");
const touchReload = document.getElementById("touch-reload");
const touchRush = document.getElementById("touch-rush");
const touchButtons = document.getElementById("touch-buttons");
const touchLayoutBtn = document.getElementById("touchLayoutBtn");
const touchLayoutOverlay = document.getElementById("touch-layout");
const touchLayoutDone = document.getElementById("touch-layout-done");
const touchLayoutReset = document.getElementById("touch-layout-reset");

let menuMode = "start";
let killCardTimer = 0;
let touchLayout = null;
let touchLayoutDefault = null;
let damagePulse = 0;
let isStarting = false;
let loadingTimer = null;
let lastStatsHeight = 0;

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
  winKills: 30,
  winTeamKills: 50,
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
  zoneFlash: {
    duration: 0.6,
    strength: 0.35,
  },
};

const palette = [
  "#72e6ff",
  "#ff9f7a",
  "#a6ff9c",
  "#ffd06b",
  "#b69cff",
  "#ff8fd8",
];

const skins = [
  { id: "custom", name: "Custom Color", type: "color", accent: palette[0] },
  { id: "darkVoid", name: "Dark Void", type: "image", src: "Skins/Dark Void.png", accent: "#b69cff" },
  { id: "galexyMatter", name: "Galexy Matter", type: "image", src: "Skins/Galexy Matter.png", accent: "#72e6ff" },
  { id: "bioVoid", name: "Bio Void", type: "image", src: "Skins/Bio Void.png", accent: "#7affc7" },
  { id: "arcReactor", name: "Arc Reactor", type: "image", src: "Skins/Arc Reactor.png", accent: "#7ad6ff" },
  { id: "fusionNexus", name: "Fusion Nexus", type: "image", src: "Skins/Fusion Nexus.png", accent: "#8fd2ff" },
  { id: "skin5", name: "Molten Core", type: "image", src: "Skins/Molten Core.png", accent: "#ff9f7a" },
];
const skinImages = {};
const crownImage = new Image();
const crownImageSrc = "Skins/crown.png";
try {
  crownImage.src = encodeURI(crownImageSrc);
} catch (err) {
  crownImage.src = crownImageSrc;
}
let selectedSkinId = "custom";
let selectedShieldColor = "#72e6ff";
const SETTINGS_KEY = "echo-drift-settings";
const PERSIST_SETTINGS = true;
const MAX_PLAYERS = 15;
const MAX_PLAYERS_TDM = 14;
const GAME_MODES = {
  multiplayer: { id: "multiplayer", label: "Multiplayer Arena" },
  energy: { id: "energy", label: "Energy Rush" },
  kills: { id: "kills", label: "Kill Race" },
  hill: { id: "hill", label: "King of the Hill" },
  tdm: { id: "tdm", label: "Team Deathmatch" },
};
let selectedModeId = "energy";
const BOT_DIFFICULTY = {
  easy: "easy",
  normal: "normal",
  hard: "hard",
};
const BOT_TUNING = {
  [BOT_DIFFICULTY.easy]: {
    id: BOT_DIFFICULTY.easy,
    speedMult: 0.85,
    maxSpeedMult: 0.9,
    reactionMult: 1.35,
    aimJitterMult: 1.25,
    aggroMult: 0.85,
    threatRangeMult: 0.85,
    shootRangeMult: 0.9,
    rushChanceMult: 0.75,
    braceDistMult: 0.85,
    braceHealthMult: 0.8,
    braceTimeMult: 0.85,
    fleeHealthMult: 1.1,
    shieldStartFrac: 0.36,
    shieldStopFrac: 0.16,
    shieldHoldMult: 0.75,
    shieldRestMult: 1.35,
    streamChanceMult: 0.9,
  },
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
  [BOT_DIFFICULTY.hard]: {
    id: BOT_DIFFICULTY.hard,
    speedMult: 1.12,
    maxSpeedMult: 1.08,
    reactionMult: 0.75,
    aimJitterMult: 0.7,
    aggroMult: 1.15,
    threatRangeMult: 1.2,
    shootRangeMult: 1.1,
    rushChanceMult: 1.2,
    braceDistMult: 1.2,
    braceHealthMult: 1.15,
    braceTimeMult: 1.15,
    fleeHealthMult: 0.85,
    shieldStartFrac: 0.22,
    shieldStopFrac: 0.08,
    shieldHoldMult: 1.15,
    shieldRestMult: 0.7,
    streamChanceMult: 1,
  },
};
let selectedBotDifficulty = BOT_DIFFICULTY.normal;
let currentBotDifficulty = BOT_DIFFICULTY.normal;
const TEAM_COLORS = {
  red: "#ff6b6b",
  blue: "#72e6ff",
};
const teamScores = { red: 0, blue: 0 };

function formatNumber(value) {
  return Math.round(value).toLocaleString();
}

function isMultiplayerMode() {
  return selectedModeId === "multiplayer";
}

function isKillMode() {
  return selectedModeId === "kills";
}

function isHillMode() {
  return selectedModeId === "hill";
}

function isTdmMode() {
  return selectedModeId === "tdm";
}

function isEnergyMode() {
  return selectedModeId === "energy" || isMultiplayerMode();
}

function getModePlayerCap() {
  return isTdmMode() ? MAX_PLAYERS_TDM : MAX_PLAYERS;
}

function getModeStatusText() {
  if (isTdmMode()) {
    return gameActive
      ? `Team Deathmatch: ${getTeamScoreText()}. First to ${CONFIG.winTeamKills} team kills.`
      : `Team Deathmatch: First to ${CONFIG.winTeamKills} team kills.`;
  }
  if (isMultiplayerMode()) {
    const cap = getModePlayerCap();
    return `Multiplayer Arena: ${cap} pilots max. Bots fill open slots. First to ${formatNumber(CONFIG.winEnergy)} energy wins.`;
  }
  if (isHillMode()) {
    return `King of the Hill: ${formatTime(HILL_DURATION)}. Most kills wins.`;
  }
  if (isKillMode()) {
    return `First to ${CONFIG.winKills} kills wins.`;
  }
  return `First to ${formatNumber(CONFIG.winEnergy)} energy wins.`;
}

function getModeHintText() {
  if (isTdmMode()) {
    return `Team Deathmatch: Red vs Blue. First to ${CONFIG.winTeamKills} team kills wins.`;
  }
  if (isMultiplayerMode()) {
    const cap = getModePlayerCap();
    return `Multiplayer Arena: ${cap} pilots max. Bots fill open slots. First to ${formatNumber(CONFIG.winEnergy)} energy wins.`;
  }
  if (isHillMode()) {
    return `King of the Hill: ${formatTime(HILL_DURATION)}. Most kills wins.`;
  }
  if (isKillMode()) {
    return `First to ${CONFIG.winKills} kills wins the match.`;
  }
  return `First to ${formatNumber(CONFIG.winEnergy)} energy wins the match.`;
}

function getModeVictoryDetail(winner) {
  if (isTdmMode()) {
    const team = typeof winner === "string" ? winner : winner && winner.team;
    const label = team === "red" ? "Red Team" : "Blue Team";
    return `${label} wins ${teamScores.red} - ${teamScores.blue}.`;
  }
  if (isHillMode()) {
    return `${winner.name} led with ${winner.kills} kills.`;
  }
  if (isKillMode()) {
    return `${winner.name} hit ${CONFIG.winKills} kills.`;
  }
  return `${winner.name} reached ${formatNumber(CONFIG.winEnergy)} energy.`;
}

function getBotTuning(difficulty) {
  return BOT_TUNING[difficulty] || BOT_TUNING[BOT_DIFFICULTY.normal];
}

function resetTeamScores() {
  teamScores.red = 0;
  teamScores.blue = 0;
}

function getTeamScoreText() {
  return `RED ${teamScores.red} - ${teamScores.blue} BLUE`;
}

function getTeamWinner() {
  if (teamScores.red === teamScores.blue) return null;
  return teamScores.red > teamScores.blue ? "red" : "blue";
}

function getTeamLabel(team) {
  return team === "red" ? "Red Team" : "Blue Team";
}

function getTeamColor(team) {
  return TEAM_COLORS[team] || "#72e6ff";
}

function getBalancedTeam() {
  if (!isTdmMode()) return null;
  let red = 0;
  let blue = 0;
  for (const player of players) {
    if (player.team === "red") red += 1;
    if (player.team === "blue") blue += 1;
  }
  return red <= blue ? "red" : "blue";
}

function getTeamSpawnBounds(team) {
  const margin = 220;
  const mid = CONFIG.world.w / 2;
  const gap = 260;
  if (!isTdmMode() || !team) {
    return { minX: margin, maxX: CONFIG.world.w - margin, minY: margin, maxY: CONFIG.world.h - margin };
  }
  if (team === "red") {
    return {
      minX: margin,
      maxX: Math.max(margin + 200, mid - gap),
      minY: margin,
      maxY: CONFIG.world.h - margin,
    };
  }
  return {
    minX: Math.min(CONFIG.world.w - margin - 200, mid + gap),
    maxX: CONFIG.world.w - margin,
    minY: margin,
    maxY: CONFIG.world.h - margin,
  };
}

function getHillLeader() {
  let leader = null;
  for (const player of players) {
    if (
      !leader ||
      player.kills > leader.kills ||
      (player.kills === leader.kills && player.energy > leader.energy)
    ) {
      leader = player;
    }
  }
  return leader;
}

function getModeLabel() {
  return GAME_MODES[selectedModeId].label || "Arena";
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatAccuracy(player) {
  if (!player || player.shotsFired <= 0) return "0%";
  const raw = (player.shotsHit / player.shotsFired) * 100;
  return `${Math.round(clamp(raw, 0, 100))}%`;
}

function buildPostMatchBreakdown(winnerName) {
  if (!localPlayer) return "";
  const lines = [
    "Post-match breakdown",
    "",
    `Winner: ${winnerName} - ${getModeLabel()}`,
    ...(isTdmMode() ? [`Final score: ${getTeamScoreText()}`] : []),
    `Time survived: ${formatTime(gameTime)}`,
    `Energy gained: ${formatNumber(localPlayer.energyGained)}`,
    `Kills/Deaths: ${localPlayer.kills}/${localPlayer.deaths}`,
    `Highest streak: ${localPlayer.maxKillStreak}`,
    `Accuracy (est.): ${formatAccuracy(localPlayer)}`,
  ];
  return lines.join("\n");
}

function updateMenuStatus() {
  if (menuStatus && menuMode === "start") menuStatus.textContent = getModeStatusText();
}

function setSelectedMode(modeId) {
  if (!GAME_MODES[modeId]) return;
  selectedModeId = modeId;
  if (modeSelect && modeSelect.value !== modeId) modeSelect.value = modeId;
  updateMenuStatus();
}

function updateBotDifficultyStyle() {
  if (!botDifficultySelect) return;
  botDifficultySelect.classList.remove("difficulty-easy", "difficulty-normal", "difficulty-hard");
  const value = botDifficultySelect.value;
  if (value === "easy") botDifficultySelect.classList.add("difficulty-easy");
  if (value === "normal") botDifficultySelect.classList.add("difficulty-normal");
  if (value === "hard") botDifficultySelect.classList.add("difficulty-hard");
}

function normalizeTouchLayout(layout) {
  if (!layout || typeof layout !== "object") return null;
  const result = {};
  const keys = ["move", "aim", "buttons"];
  for (const key of keys) {
    const item = layout[key];
    if (!item || typeof item !== "object") continue;
    if (typeof item.x !== "number" || typeof item.y !== "number") continue;
    result[key] = {
      x: clamp(item.x, 0.05, 0.95),
      y: clamp(item.y, 0.05, 0.95),
    };
  }
  return Object.keys(result).length ? result : null;
}

function cloneTouchLayout(layout) {
  if (!layout) return null;
  return {
    move: layout.move ? { ...layout.move } : undefined,
    aim: layout.aim ? { ...layout.aim } : undefined,
    buttons: layout.buttons ? { ...layout.buttons } : undefined,
  };
}

function shouldPersistSettings() {
  if (!PERSIST_SETTINGS) return false;
  if (!rememberToggle) return true;
  return rememberToggle.checked;
}

function saveSettings() {
  if (!PERSIST_SETTINGS) return;
  if (typeof localStorage === "undefined") return;
  if (!shouldPersistSettings()) {
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (err) {
      return;
    }
    return;
  }
  const payload = {
    name: nameInput ? nameInput.value : "",
    skinId: selectedSkinId,
    skinColor: colorInput ? colorInput.value : palette[0],
    shieldColor: shieldColorInput ? shieldColorInput.value : selectedShieldColor,
    modeId: selectedModeId,
    botDifficulty: selectedBotDifficulty,
    musicEnabled: musicToggle ? musicToggle.checked : true,
    sfxEnabled: sfxToggle ? sfxToggle.checked : true,
    musicVolume: musicVolume ? Number(musicVolume.value) : 26,
    sfxVolume: sfxVolume ? Number(sfxVolume.value) : 55,
    touchLayout: touchLayout ? cloneTouchLayout(touchLayout) : null,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  } catch (err) {
    return;
  }
}

function loadSettings() {
  if (!PERSIST_SETTINGS) return;
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return;
    if (rememberToggle) rememberToggle.checked = true;
    if (typeof data.name === "string" && nameInput) nameInput.value = data.name;
    if (typeof data.skinId === "string" && skins.some((skin) => skin.id === data.skinId)) {
      selectedSkinId = data.skinId;
    }
    if (typeof data.skinColor === "string" && colorInput) colorInput.value = data.skinColor;
    if (typeof data.shieldColor === "string" && shieldColorInput) {
      shieldColorInput.value = data.shieldColor;
    }
    if (typeof data.modeId === "string" && GAME_MODES[data.modeId]) {
      setSelectedMode(data.modeId);
    }
    if (typeof data.botDifficulty === "string" && BOT_TUNING[data.botDifficulty]) {
      selectedBotDifficulty = data.botDifficulty;
      if (botDifficultySelect) botDifficultySelect.value = selectedBotDifficulty;
    }
    if (typeof data.musicEnabled === "boolean" && musicToggle) {
      musicToggle.checked = data.musicEnabled;
    }
    if (typeof data.sfxEnabled === "boolean" && sfxToggle) sfxToggle.checked = data.sfxEnabled;
    if (typeof data.musicVolume === "number" && musicVolume) {
      musicVolume.value = clamp(data.musicVolume, 0, 100);
    }
    if (typeof data.sfxVolume === "number" && sfxVolume) {
      sfxVolume.value = clamp(data.sfxVolume, 0, 100);
    }
    if (data.touchLayout) {
      touchLayout = normalizeTouchLayout(data.touchLayout);
    }
    updateBotDifficultyStyle();
  } catch (err) {
    return;
  }
}

let width = 0;
let height = 0;
let dpr = 1;
let gameTime = 0;
let gameActive = false;
let localPlayer = null;
let touchReady = false;
const MINIMAP_SIZE = 180;

function resize() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const miniSize = Math.floor(MINIMAP_SIZE * dpr);
  minimap.width = miniSize;
  minimap.height = miniSize;
  minimapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  updateTouchLayoutForViewport();
}

window.addEventListener("resize", resize);
resize();

const input = {
  keys: {},
  mouse: { x: width / 2, y: height / 2, down: false, rightDown: false },
  move: { x: 0, y: 0, active: false },
  aim: { x: 1, y: 0, active: false },
};

const touchState = {
  enabled: false,
  move: { id: null, active: false, stick: null },
  aim: { id: null, active: false, stick: null },
  activePointers: 0,
  editing: false,
};

const touchDrag = {
  active: false,
  id: null,
  key: null,
  target: null,
  offsetX: 0,
  offsetY: 0,
};
touchReady = true;

function detectTouchDevice() {
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
  );
}

function setTouchControlsVisible(show) {
  if (!touchControls) return;
  touchControls.classList.toggle("active", show && touchState.enabled);
  if (show && touchState.enabled) {
    requestAnimationFrame(() => {
      updateTouchLayoutForViewport();
    });
  }
}

function trackTouchPointer(active) {
  if (!touchState.enabled) return;
  touchState.activePointers += active ? 1 : -1;
  if (touchState.activePointers < 0) touchState.activePointers = 0;
}

function readElementCenter(el) {
  if (!el || !window.innerWidth || !window.innerHeight) return null;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

function readTouchLayoutFromElements() {
  const move = readElementCenter(touchMove);
  const aim = readElementCenter(touchAim);
  const buttons = readElementCenter(touchButtons);
  if (!move || !aim || !buttons) return null;
  return { move, aim, buttons };
}

function ensureTouchLayoutDefault() {
  if (touchLayoutDefault) return;
  const layout = readTouchLayoutFromElements();
  if (layout) touchLayoutDefault = layout;
}

function positionTouchElement(el, pos) {
  if (!el || !pos || !window.innerWidth || !window.innerHeight) return null;
  const rect = el.getBoundingClientRect();
  const width = rect.width || el.offsetWidth;
  const height = rect.height || el.offsetHeight;
  if (!width || !height) return null;
  const halfW = width / 2;
  const halfH = height / 2;
  const px = clamp(pos.x, 0, 1) * window.innerWidth;
  const py = clamp(pos.y, 0, 1) * window.innerHeight;
  const x = clamp(px, halfW + 6, window.innerWidth - halfW - 6);
  const y = clamp(py, halfH + 6, window.innerHeight - halfH - 6);
  el.style.left = `${x - halfW}px`;
  el.style.top = `${y - halfH}px`;
  el.style.right = "auto";
  el.style.bottom = "auto";
  return { x: x / window.innerWidth, y: y / window.innerHeight };
}

function applyTouchLayout(layout) {
  if (!layout) return;
  if (layout.move) positionTouchElement(touchMove, layout.move);
  if (layout.aim) positionTouchElement(touchAim, layout.aim);
  if (layout.buttons) positionTouchElement(touchButtons, layout.buttons);
}

function updateTouchLayoutForViewport() {
  if (!touchReady) return;
  if (!touchState.enabled) return;
  ensureTouchLayoutDefault();
  const merged = {
    move: (touchLayout && touchLayout.move) || (touchLayoutDefault && touchLayoutDefault.move),
    aim: (touchLayout && touchLayout.aim) || (touchLayoutDefault && touchLayoutDefault.aim),
    buttons: (touchLayout && touchLayout.buttons) || (touchLayoutDefault && touchLayoutDefault.buttons),
  };
  if (merged.move || merged.aim || merged.buttons) {
    applyTouchLayout(merged);
  }
}

function setTouchLayoutEditing(editing) {
  touchState.editing = editing;
  if (touchControls) touchControls.classList.toggle("editing", editing);
  if (touchLayoutOverlay) touchLayoutOverlay.classList.toggle("active", editing);
  if (menu) menu.classList.toggle("editing-touch", editing);
  if (!editing) {
    touchDrag.active = false;
    touchDrag.id = null;
    touchDrag.key = null;
    touchDrag.target = null;
  }
  setTouchControlsVisible(editing || gameActive);
}

function beginTouchDrag(e, target, key) {
  if (!touchState.enabled || !touchState.editing) return;
  e.preventDefault();
  touchDrag.active = true;
  touchDrag.id = e.pointerId;
  touchDrag.key = key;
  touchDrag.target = target;
  const rect = target.getBoundingClientRect();
  touchDrag.offsetX = e.clientX - (rect.left + rect.width / 2);
  touchDrag.offsetY = e.clientY - (rect.top + rect.height / 2);
  target.setPointerCapture(e.pointerId);
}

function updateTouchDrag(e) {
  if (!touchDrag.active || touchDrag.id !== e.pointerId || !touchDrag.target) return;
  const centerX = e.clientX - touchDrag.offsetX;
  const centerY = e.clientY - touchDrag.offsetY;
  const next = positionTouchElement(touchDrag.target, { x: centerX / window.innerWidth, y: centerY / window.innerHeight });
  if (!next) return;
  if (!touchLayout) touchLayout = {};
  touchLayout[touchDrag.key] = next;
}

function endTouchDrag(e) {
  if (!touchDrag.active || touchDrag.id !== e.pointerId) return;
  touchDrag.active = false;
  touchDrag.id = null;
  touchDrag.key = null;
  touchDrag.target = null;
  saveSettings();
}

function setupDragTarget(target, key) {
  if (!target) return;
  target.addEventListener(
    "pointerdown",
    (e) => {
      if (!touchState.editing) return;
      beginTouchDrag(e, target, key);
    },
    { passive: false }
  );
  target.addEventListener("pointermove", updateTouchDrag);
  target.addEventListener("pointerup", endTouchDrag);
  target.addEventListener("pointercancel", endTouchDrag);
}

function resetTouchLayout() {
  ensureTouchLayoutDefault();
  if (!touchLayoutDefault) return;
  touchLayout = cloneTouchLayout(touchLayoutDefault);
  updateTouchLayoutForViewport();
  saveSettings();
}

function updateStick(stick, dx, dy, max) {
  const dist = Math.hypot(dx, dy);
  const scale = dist > max ? max / dist : 1;
  const x = dx * scale;
  const y = dy * scale;
  if (stick) stick.style.transform = `translate(${x}px, ${y}px)`;
  return { x: max ? x / max : 0, y: max ? y / max : 0, dist };
}

function setupJoystick(pad, mode) {
  if (!pad) return;
  const stick = pad.querySelector(".joy-stick");
  if (!stick) return;
  const state = mode === "move" ? touchState.move : touchState.aim;
  state.stick = stick;

  const handleMove = (e) => {
    const rect = pad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const max = Math.min(rect.width, rect.height) * 0.35;
    const result = updateStick(stick, e.clientX - centerX, e.clientY - centerY, max);
    if (mode === "move") {
      input.move.x = result.x;
      input.move.y = result.y;
      input.move.active = result.dist > max * 0.12;
    } else {
      const deadzone = max * 0.12;
      if (result.dist > deadzone) {
        input.aim.x = result.x;
        input.aim.y = result.y;
      }
      input.aim.active = true;
      input.mouse.down = true;
    }
  };

  pad.addEventListener(
    "pointerdown",
    (e) => {
      if (!touchState.enabled || touchState.editing) return;
      e.preventDefault();
      trackTouchPointer(true);
      state.id = e.pointerId;
      state.active = true;
      pad.setPointerCapture(e.pointerId);
      handleMove(e);
    },
    { passive: false }
  );

  pad.addEventListener("pointermove", (e) => {
    if (!state.active || state.id !== e.pointerId) return;
    handleMove(e);
  });

  const end = (e) => {
    if (state.id !== e.pointerId) return;
    trackTouchPointer(false);
    state.id = null;
    state.active = false;
    if (stick) stick.style.transform = "translate(0px, 0px)";
    if (mode === "move") {
      input.move.active = false;
      input.move.x = 0;
      input.move.y = 0;
    } else {
      input.aim.active = false;
      input.mouse.down = false;
    }
  };

  pad.addEventListener("pointerup", end);
  pad.addEventListener("pointercancel", end);
}

function bindTouchButton(button, action) {
  if (!button) return;
  button.addEventListener(
    "pointerdown",
    (e) => {
      if (!touchState.enabled || touchState.editing) return;
      e.preventDefault();
      button.setPointerCapture(e.pointerId);
      trackTouchPointer(true);
      if (action.key) input.keys[action.key] = true;
      if (action.mouse === "left") input.mouse.down = true;
      if (action.mouse === "right") input.mouse.rightDown = true;
    },
    { passive: false }
  );

  const end = (e) => {
    trackTouchPointer(false);
    if (action.key) input.keys[action.key] = false;
    if (action.mouse === "left") input.mouse.down = false;
    if (action.mouse === "right") input.mouse.rightDown = false;
  };

  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
}

function enableTouchControls() {
  touchState.enabled = detectTouchDevice();
  if (touchLayoutBtn) {
    touchLayoutBtn.style.display = touchState.enabled ? "inline-flex" : "none";
  }
  if (!touchState.enabled) return;
  setupJoystick(touchMove, "move");
  setupJoystick(touchAim, "aim");
  bindTouchButton(touchRay, { mouse: "right" });
  bindTouchButton(touchShield, { key: "shift" });
  bindTouchButton(touchReload, { key: "r" });
  bindTouchButton(touchRush, { key: "space" });
  setupDragTarget(touchMove, "move");
  setupDragTarget(touchAim, "aim");
  setupDragTarget(touchButtons, "buttons");
  if (touchLayoutBtn) {
    touchLayoutBtn.addEventListener("click", () => {
      setTouchLayoutEditing(true);
    });
  }
  if (touchLayoutDone) {
    touchLayoutDone.addEventListener("click", () => {
      setTouchLayoutEditing(false);
    });
  }
  if (touchLayoutReset) {
    touchLayoutReset.addEventListener("click", () => {
      resetTouchLayout();
    });
  }
  if (touchLayoutOverlay) {
    touchLayoutOverlay.addEventListener("click", (e) => {
      if (e.target === touchLayoutOverlay) setTouchLayoutEditing(false);
    });
  }
  setTouchControlsVisible(gameActive);
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const code = e.code ? e.code.toLowerCase() : key;
  input.keys[key] = true;
  input.keys[code] = true;
  if (gameActive && (code === "space" || key === " ")) e.preventDefault();
});
window.addEventListener("keyup", (e) => {
  input.keys[e.key.toLowerCase()] = false;
  input.keys[e.code.toLowerCase()] = false;
  if (gameActive && (e.code && e.code.toLowerCase() === "space" || e.key === " ")) e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (touchState.enabled && touchState.activePointers > 0) return;
  input.mouse.x = e.clientX;
  input.mouse.y = e.clientY;
});
window.addEventListener("mousedown", (e) => {
  if (touchState.enabled && touchState.activePointers > 0) return;
  if (e.button === 0) input.mouse.down = true;
  if (e.button === 2) input.mouse.rightDown = true;
});
window.addEventListener("mouseup", (e) => {
  if (touchState.enabled && touchState.activePointers > 0) return;
  if (e.button === 0) input.mouse.down = false;
  if (e.button === 2) input.mouse.rightDown = false;
});
window.addEventListener("contextmenu", (e) => e.preventDefault());

function loadSkinImages() {
  for (const skin of skins) {
    if (skin.type !== "image") continue;
    const img = new Image();
    img.src = encodeURI(skin.src);
    skinImages[skin.id] = img;
  }
}

function getSkinById(id) {
  return skins.find((skin) => skin.id === id) || skins[0];
}

function getSelectedSkin() {
  const base = getSkinById(selectedSkinId);
  if (base.type === "color") {
    const color = colorInput ? colorInput.value : palette[0];
    return { ...base, color, accent: color };
  }
  return base;
}

function updateSkinUI() {
  const skin = getSelectedSkin();
  if (skinName) skinName.textContent = skin.name;
  if (skinPreview) {
    if (skin.type === "image") {
      skinPreview.style.backgroundImage = `url("${encodeURI(skin.src)}")`;
      skinPreview.style.backgroundColor = "transparent";
      skinPreview.style.backgroundSize = "cover";
      skinPreview.style.backgroundPosition = "center";
    } else {
      skinPreview.style.backgroundImage = "none";
      skinPreview.style.backgroundColor = skin.color;
      skinPreview.style.backgroundSize = "cover";
      skinPreview.style.backgroundPosition = "center";
    }
  }
  if (skinGrid) {
    const items = skinGrid.querySelectorAll(".skin-item");
    items.forEach((item) => {
      const id = item.dataset.skinId;
      item.classList.toggle("selected", id === selectedSkinId);
      if (id === "custom") {
        const thumb = item.querySelector(".skin-thumb");
        if (thumb && colorInput) {
          thumb.style.backgroundImage = "none";
          thumb.style.backgroundColor = colorInput.value;
          thumb.style.backgroundSize = "cover";
          thumb.style.backgroundPosition = "center";
        }
      }
    });
  }
}

function updateShieldUI() {
  if (!shieldPreview) return;
  const color = shieldColorInput ? shieldColorInput.value : selectedShieldColor;
  selectedShieldColor = color;
  shieldPreview.style.background = color;
  shieldPreview.style.boxShadow = `0 0 16px ${colorWithAlpha(color, 0.4)}`;
}

function buildSkinMenu() {
  if (!skinGrid) return;
  skinGrid.innerHTML = "";
  skins.forEach((skin) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "skin-item";
    item.dataset.skinId = skin.id;

    const thumb = document.createElement("div");
    thumb.className = "skin-thumb";
    if (skin.type === "image") {
      thumb.style.backgroundImage = `url("${encodeURI(skin.src)}")`;
      thumb.style.backgroundColor = "transparent";
      thumb.style.backgroundSize = "cover";
      thumb.style.backgroundPosition = "center";
    } else if (colorInput) {
      thumb.style.backgroundImage = "none";
      thumb.style.backgroundColor = colorInput.value;
      thumb.style.backgroundSize = "cover";
      thumb.style.backgroundPosition = "center";
    }

    const label = document.createElement("div");
    label.textContent = skin.name;

    item.appendChild(thumb);
    item.appendChild(label);
    item.addEventListener("click", () => {
      selectedSkinId = skin.id;
      updateSkinUI();
      saveSettings();
    });
    skinGrid.appendChild(item);
  });
  updateSkinUI();
}

function resetInputState() {
  for (const key in input.keys) delete input.keys[key];
  input.mouse.down = false;
  input.mouse.rightDown = false;
  input.move.active = false;
  input.move.x = 0;
  input.move.y = 0;
  input.aim.active = false;
  touchState.move.active = false;
  touchState.move.id = null;
  touchState.aim.active = false;
  touchState.aim.id = null;
  touchState.activePointers = 0;
  if (touchState.move.stick) touchState.move.stick.style.transform = "translate(0px, 0px)";
  if (touchState.aim.stick) touchState.aim.stick.style.transform = "translate(0px, 0px)";
}

function updateMenuMode() {
  const locked = menuMode === "victory" || menuMode === "defeat" || gameActive || isStarting;
  playBtn.textContent = locked ? "Continue" : "Play";
  nameInput.disabled = locked;
  if (rememberToggle) rememberToggle.disabled = locked;
  colorInput.disabled = locked;
  if (modeSelect) modeSelect.disabled = locked;
  if (botDifficultySelect) {
    if (botDifficultySelect.value !== selectedBotDifficulty) {
      botDifficultySelect.value = selectedBotDifficulty;
    }
    updateBotDifficultyStyle();
    botDifficultySelect.disabled = locked;
  }
  if (skinBtn) skinBtn.disabled = locked;
  if (locked && skinMenu) skinMenu.classList.remove("show");
  if (shieldBtn) shieldBtn.disabled = locked;
  if (locked && shieldMenu) shieldMenu.classList.remove("show");
  if (touchLayoutBtn) touchLayoutBtn.disabled = locked;
}

function showMenu(
  message = getModeStatusText(),
  mode = "start",
  detail = "",
  meta = ""
) {
  if (touchState.editing) setTouchLayoutEditing(false);
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  isStarting = false;
  if (loadingScreen) loadingScreen.classList.remove("show");
  menu.classList.remove("fading");
  menuMode = mode;
  menu.classList.add("show");
  menu.classList.toggle("victory", mode === "victory");
  menu.classList.toggle("defeat", mode === "defeat");
  ui.classList.add("hidden");
  gameActive = false;
  setTouchControlsVisible(false);
  resetInputState();
  if (rushIndicator) rushIndicator.classList.remove("show");
  if (beamIndicator) beamIndicator.classList.remove("show");
  if (streamIndicator) streamIndicator.classList.remove("show");
  if (zoneIndicator) zoneIndicator.classList.remove("show");
  if (crosshair) crosshair.classList.remove("show");
  if (killCard) killCard.classList.remove("show");
  if (killPraise) killPraise.classList.remove("show");
  if (reloadIndicator) reloadIndicator.classList.remove("show");
  if (matchTimer) matchTimer.classList.remove("show");
  if (menuStatus) menuStatus.textContent = message;
  if (menuRoast) menuRoast.textContent = detail;
  if (menuMeta) menuMeta.textContent = meta;
  if (endTitle) endTitle.textContent = mode === "victory" ? "Victory" : "Defeated";
  if (endRoast) endRoast.textContent = detail;
  if (endMeta) endMeta.textContent = meta;
  updateMenuMode();
  if (nameInput && menuMode === "start") nameInput.focus();
  if (menuMode === "victory") playSfx("victory");
  if (menuMode === "defeat") playSfx("defeat");
}

function startGame() {
  if (touchState.editing) setTouchLayoutEditing(false);
  const name = nameInput.value.trim() || "Pilot";
  const skin = getSelectedSkin();
  const shieldColor = shieldColorInput ? shieldColorInput.value : selectedShieldColor;
  if (botDifficultySelect) {
    selectedBotDifficulty = botDifficultySelect.value;
  }
  currentBotDifficulty = selectedBotDifficulty;
  saveSettings();
  ensureAudio();
  setMusicEnabled(musicToggle.checked);
  setSfxEnabled(sfxToggle.checked);
  audio.musicLevel = clamp(musicVolume.value / 100, 0, 1) * 0.2;
  audio.sfxLevel = clamp(sfxVolume.value / 100, 0, 1) * 0.8;
  if (audio.musicEnabled) audio.musicGain.gain.value = audio.musicLevel;
  if (audio.sfxEnabled) audio.sfxGain.gain.value = audio.sfxLevel;
  startMusic();
  initGame(name, skin, shieldColor);
  menu.classList.remove("show");
  menu.classList.remove("victory", "defeat");
  ui.classList.remove("hidden");
  if (skinMenu) skinMenu.classList.remove("show");
  if (shieldMenu) shieldMenu.classList.remove("show");
  resetInputState();
  gameActive = true;
  setTouchControlsVisible(true);
  if (document.activeElement) document.activeElement.blur();
  if (menuStatus) menuStatus.textContent = getModeStatusText();
  if (menuRoast) menuRoast.textContent = "";
  menuMode = "start";
  updateMenuMode();
}

function startGameTransition() {
  if (isStarting) return;
  isStarting = true;
  if (loadingScreen) loadingScreen.classList.add("show");
  menu.classList.add("fading");
  if (loadingTimer) clearTimeout(loadingTimer);
  loadingTimer = setTimeout(() => {
    startGame();
    menu.classList.remove("fading");
    loadingTimer = setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.remove("show");
      isStarting = false;
      loadingTimer = null;
    }, 320);
  }, 1420);
}

function handlePlayClick() {
  if (menuMode === "victory" || menuMode === "defeat") {
    showMenu(getModeStatusText(), "start", "");
    return;
  }
  startGameTransition();
}

playBtn.addEventListener("click", handlePlayClick);
playBtn.addEventListener("click", () => playSfx("click"));
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handlePlayClick();
});
nameInput.addEventListener("input", () => {
  saveSettings();
});
nameInput.addEventListener("focus", () => playSfx("click"));
if (rememberToggle) {
  rememberToggle.addEventListener("change", () => {
    playSfx("click");
    saveSettings();
  });
}
if (modeSelect) {
  modeSelect.addEventListener("change", () => {
    playSfx("click");
    setSelectedMode(modeSelect.value);
    saveSettings();
  });
}
if (botDifficultySelect) {
  botDifficultySelect.addEventListener("change", () => {
    playSfx("click");
    selectedBotDifficulty = botDifficultySelect.value;
    updateBotDifficultyStyle();
    saveSettings();
  });
}
if (endContinue) {
  endContinue.addEventListener("click", () => {
    playSfx("click");
    showMenu(getModeStatusText(), "start", "");
  });
}

  if (skinBtn && skinMenu) {
    skinBtn.addEventListener("click", () => {
      playSfx("click");
      skinMenu.classList.add("show");
      updateSkinUI();
    });
  }
  if (skinClose && skinMenu) {
    skinClose.addEventListener("click", () => {
      playSfx("click");
      skinMenu.classList.remove("show");
      updateSkinUI();
    });
  }
  if (skinMenu) {
    skinMenu.addEventListener("click", (e) => {
      if (e.target === skinMenu) {
        playSfx("click");
        skinMenu.classList.remove("show");
        updateSkinUI();
      }
    });
  }
  if (colorInput) {
    colorInput.addEventListener("input", () => {
      playSfx("click");
      selectedSkinId = "custom";
      updateSkinUI();
      saveSettings();
    });
  }
loadSettings();
if (botDifficultySelect) {
  botDifficultySelect.value = selectedBotDifficulty;
  updateBotDifficultyStyle();
}
buildSkinMenu();
loadSkinImages();
updateShieldUI();
enableTouchControls();

  if (shieldBtn && shieldMenu) {
    shieldBtn.addEventListener("click", () => {
      playSfx("click");
      shieldMenu.classList.add("show");
      updateShieldUI();
    });
  }
  if (shieldClose && shieldMenu) {
    shieldClose.addEventListener("click", () => {
      playSfx("click");
      shieldMenu.classList.remove("show");
      updateShieldUI();
    });
  }
  if (shieldMenu) {
    shieldMenu.addEventListener("click", (e) => {
      if (e.target === shieldMenu) {
        playSfx("click");
        shieldMenu.classList.remove("show");
        updateShieldUI();
      }
    });
  }
  if (shieldColorInput) {
    shieldColorInput.addEventListener("input", () => {
      playSfx("click");
      updateShieldUI();
      saveSettings();
    });
  }

function tryStartMenuMusic() {
  if (!musicToggle.checked) return;
  ensureAudio();
  setMusicEnabled(true);
}

menu.addEventListener("pointerdown", tryStartMenuMusic, { passive: true });
menu.addEventListener("keydown", tryStartMenuMusic);

musicToggle.addEventListener("change", () => {
  ensureAudio();
  setMusicEnabled(musicToggle.checked);
  playSfx("click");
  saveSettings();
});

sfxToggle.addEventListener("change", () => {
  ensureAudio();
  setSfxEnabled(sfxToggle.checked);
  playSfx("click");
  saveSettings();
});

musicVolume.addEventListener("input", () => {
  const level = clamp(musicVolume.value / 100, 0, 1) * 0.2;
  audio.musicLevel = level;
  if (audio.ctx && audio.musicEnabled) audio.musicGain.gain.value = level;
  if (audio.musicTrack && audio.musicEnabled) audio.musicTrack.volume = level;
  playSfx("click");
  saveSettings();
});

sfxVolume.addEventListener("input", () => {
  const level = clamp(sfxVolume.value / 100, 0, 1) * 0.8;
  audio.sfxLevel = level;
  if (audio.ctx && audio.sfxEnabled) audio.sfxGain.gain.value = level;
  playSfx("click");
  saveSettings();
});

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

function canGainEnergy(player) {
  return Math.hypot(player.vx, player.vy) > CONFIG.energyGainMinSpeed;
}

function getEnergyGainMult(player) {
  return player.streamBoostTime > 0 ? CONFIG.streamBoost.mult : 1;
}

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") return hex;
  let value = hex.trim();
  if (!value.startsWith("#")) return hex;
  value = value.slice(1);
  if (value.length === 3) {
    value = value
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  if (value.length !== 6) return hex;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function colorWithAlpha(color, alpha) {
  if (color && color.startsWith("#")) {
    return hexToRgba(color, alpha);
  }
  return color || `rgba(114, 230, 255, ${alpha})`;
}

function normalize(x, y) {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
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

function findSpawnPoint(avoid = null, minDist = CONFIG.botSpawnSafeRadius, bounds = null) {
  const avoidList = Array.isArray(avoid) ? avoid : avoid ? [avoid] : [];
  const hasTargets = avoidList.some((target) => target && target.health > 0);
  const area = bounds || {
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
  let fallbackTries = 0;
  while (fallbackTries < 120) {
    const x = randRange(area.minX, area.maxX);
    const y = randRange(area.minY, area.maxY);
    if (!zoneAt(x, y)) return { x, y };
    fallbackTries += 1;
  }
  return {
    x: randRange(area.minX, area.maxX),
    y: randRange(area.minY, area.maxY),
  };
}

function assignSpawn(player, avoid = null) {
  let avoidList = [];
  if (Array.isArray(avoid)) {
    avoidList = avoid;
  } else if (avoid) {
    avoidList = [avoid];
  }
  if (isTdmMode() && player.team) {
    avoidList = players.filter((other) => other !== player && other.team && other.team !== player.team);
  } else if (player.isLocal) {
    avoidList = avoidList.concat(players.filter((other) => other !== player));
  }
  const minDist = player.isLocal ? CONFIG.playerSpawnSafeRadius : CONFIG.botSpawnSafeRadius;
  const bounds = getTeamSpawnBounds(player.team);
  const spawn = findSpawnPoint(avoidList, minDist, bounds);
  player.x = spawn.x;
  player.y = spawn.y;
  player.lastTrail.x = spawn.x;
  player.lastTrail.y = spawn.y;
}

function nearestStreamZone(pos) {
  let best = null;
  let bestDist = Infinity;
  for (const zone of streamZones) {
    const zx = zone.shape === "rect" ? zone.x + zone.w / 2 : zone.x;
    const zy = zone.shape === "rect" ? zone.y + zone.h / 2 : zone.y;
    const d = Math.hypot(zx - pos.x, zy - pos.y);
    if (d < bestDist) {
      bestDist = d;
      best = { x: zx, y: zy };
    }
  }
  return best;
}

function nearestStreamCamper(from, self) {
  let best = null;
  let bestDist = Infinity;
  for (const other of players) {
    if (other === self) continue;
    if (isTdmMode() && self.team && other.team && self.team === other.team) continue;
    if (!other.inStream) continue;
    const d = dist(from, other);
    if (d < bestDist) {
      bestDist = d;
      best = other;
    }
  }
  return { target: best, dist: bestDist };
}

function recordHit(target, attacker, damage) {
  if (!attacker) return;
  target.lastHitBy = attacker.id;
  target.lastHitTime = gameTime;
}

function recordDamage(target) {
  target.lastDamageTime = gameTime;
}

function playHitMarker(player) {
  if (!player || !player.isLocal || !audio.sfxEnabled) return;
  const now = audio.ctx ? audio.ctx.currentTime : performance.now() / 1000;
  if (now - audio.lastHitSfx > 0.08) {
    playSfx("hit");
    audio.lastHitSfx = now;
  }
}

function applyDamage(target, amount, attacker = null) {
  if (target.bracing) {
    playHitMarker(target);
    playHitMarker(attacker);
    return false;
  }
  target.health -= amount;
  recordDamage(target);
  if (attacker) {
    recordHit(target, attacker, amount);
    playHitMarker(attacker);
  }
  playHitMarker(target);
  if (target.isLocal) {
    const scaled = Math.min(0.45, Math.max(0.08, amount / 80));
    damagePulse = Math.min(1, damagePulse + scaled);
  }
  return true;
}

const zones = [
  {
    type: "core",
    shape: "circle",
    x: CONFIG.world.w / 2,
    y: CONFIG.world.h / 2,
    r: 360,
    bonus: 1.8,
    hazard: 3,
    tint: "#72e6ff",
    color: "rgba(114, 230, 255, 0.12)",
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
    tint: "#8cdcff",
    color: "rgba(140, 220, 255, 0.08)",
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
    tint: "#8cdcff",
    color: "rgba(140, 220, 255, 0.08)",
  },
  {
    type: "bramble",
    shape: "circle",
    x: 2920,
    y: 860,
    r: 480,
    hazard: 4,
    trailTtl: 4.5,
    tint: "#ff846e",
    color: "rgba(255, 132, 110, 0.08)",
  },
  {
    type: "glimmer",
    shape: "circle",
    x: 840,
    y: 2680,
    r: 540,
    regen: 6,
    trailTtl: 12,
    tint: "#a6ff9c",
    color: "rgba(166, 255, 156, 0.08)",
  },
];

const glimmerZone = zones.find((zone) => zone.type === "glimmer");
const streamZones = zones.filter((zone) => zone.type === "stream");

function makeSeededRng(seed) {
  let value = Math.floor(seed) % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => (value = (value * 16807) % 2147483647) / 2147483647;
}

function rectRadiusAtAngle(hx, hy, angle) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const tx = dx === 0 ? Infinity : Math.abs(hx / dx);
  const ty = dy === 0 ? Infinity : Math.abs(hy / dy);
  return Math.min(tx, ty);
}

function buildZoneBlob(zone, seed) {
  const rand = makeSeededRng(seed);
  const steps = zone.shape === "rect" ? 40 : 36;
  const jitter = zone.shape === "rect" ? 0.12 : 0.1;
  const cx = zone.shape === "rect" ? zone.x + zone.w / 2 : zone.x;
  const cy = zone.shape === "rect" ? zone.y + zone.h / 2 : zone.y;
  const hx = zone.shape === "rect" ? zone.w / 2 : zone.r;
  const hy = zone.shape === "rect" ? zone.h / 2 : zone.r;
  const radii = new Array(steps);
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const base =
      zone.shape === "rect" ? rectRadiusAtAngle(hx, hy, angle) : zone.r;
    const noise = rand() * jitter;
    radii[i] = base * (1 - noise);
  }
  for (let pass = 0; pass < 2; pass++) {
    const smoothed = new Array(steps);
    for (let i = 0; i < steps; i++) {
      const prev = radii[(i - 1 + steps) % steps];
      const next = radii[(i + 1) % steps];
      smoothed[i] = (prev + radii[i] + next) / 3;
    }
    for (let i = 0; i < steps; i++) radii[i] = smoothed[i];
  }
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    points.push({
      x: cx + Math.cos(angle) * radii[i],
      y: cy + Math.sin(angle) * radii[i],
    });
  }
  zone.cx = cx;
  zone.cy = cy;
  zone.blob = points;
}

// Precompute organic zone shapes so they stay stable and readable.
function buildZoneShapes() {
  zones.forEach((zone, index) => {
    const seed =
      zone.x * 3 +
      zone.y * 7 +
      (zone.r || 0) * 11 +
      (zone.w || 0) * 5 +
      (zone.h || 0) * 9 +
      index * 97;
    buildZoneBlob(zone, seed);
  });
}

function drawZoneBlob(zone, scale = 1) {
  const points = zone.blob;
  if (!points || points.length === 0) return;
  const cx = zone.cx ?? zone.x;
  const cy = zone.cy ?? zone.y;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const px = cx + (points[i].x - cx) * scale;
    const py = cy + (points[i].y - cy) * scale;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
}

buildZoneShapes();

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

const players = [];
const trailSegments = [];
const motifs = [];
const relays = [];
const hitBursts = [];
const deathBursts = [];
const bullets = [];
const powerups = [];
const stars = [];
const STAR_COUNT = 220;
const BOT_RESPAWN_DELAY = 3;
const botRespawns = [];
const HILL_DURATION = 180;
const TDM_DURATION = 300;

function makeColorSkin(color) {
  return { id: `color-${color}`, name: "Custom Color", type: "color", color, accent: color };
}

function getBotSkin(index) {
  const imageSkins = skins.filter((skin) => skin.type === "image");
  if (imageSkins.length === 0) return makeColorSkin(palette[index % palette.length]);
  return imageSkins[index % imageSkins.length];
}

function getRandomBotName() {
  return botNames[Math.floor(Math.random() * botNames.length)];
}

function getRandomBotSkin() {
  return getBotSkin(Math.floor(Math.random() * skins.length));
}

function getBotCount() {
  return players.filter((player) => player.isBot).length;
}

function getHumanCount() {
  return players.filter((player) => !player.isBot).length;
}

function getBotLimit() {
  const cap = getModePlayerCap();
  return Math.max(0, cap - getHumanCount());
}

function spawnBot() {
  if (getBotCount() >= getBotLimit()) return;
  const team = isTdmMode() ? getBalancedTeam() : null;
  const bot = createPlayer(getRandomBotName(), false, getRandomBotSkin(), null, team);
  assignSpawn(bot, localPlayer);
  players.push(bot);
}

function createPlayer(name, isLocal = false, skin = null, handShieldColor = null, team = null) {
  const appliedSkin = skin || makeColorSkin(palette[0]);
  const accent = appliedSkin.accent || appliedSkin.color || palette[0];
  const color = appliedSkin.type === "color" ? appliedSkin.color || accent : accent;
  const shieldColor = handShieldColor || accent || color;
  const player = {
    id: `${name}-${Math.floor(Math.random() * 100000)}`,
    name,
    isLocal,
    isBot: !isLocal,
    team,
    botTuning: isLocal ? null : getBotTuning(currentBotDifficulty),
    color,
    skin: { ...appliedSkin, color, accent },
    handShieldColor: shieldColor,
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
    rushSfxTimer: 0,
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
    ai: {
      target: { x: randRange(0, CONFIG.world.w), y: randRange(0, CONFIG.world.h) },
      retarget: 0,
      fire: 0,
      fireMode: false,
      braceIntent: 0,
      shieldIntent: 0,
      shieldRest: 0,
      aimTimer: 0,
      aimJitter: 0,
    },
  };
  player.lastTrail.x = player.x;
  player.lastTrail.y = player.y;
  return player;
}

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

function spawnMotif() {
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
  motifs.push({ x, y, value: CONFIG.motifs.value });
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

function spawnRelay(relay) {
  const candidates = zones.filter((zone) => zone.type !== "stream");
  const zone = candidates[Math.floor(Math.random() * candidates.length)];
  const pos = randomPointInZone(zone);
  relay.x = pos.x;
  relay.y = pos.y;
  relay.active = true;
}

function initStars() {
  if (stars.length) return;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: randRange(0, CONFIG.world.w),
      y: randRange(0, CONFIG.world.h),
      r: randRange(0.6, 1.8),
      a: randRange(0.08, 0.3),
      hue: randRange(180, 220),
    });
  }
}

function initWorld() {
  trailSegments.length = 0;
  motifs.length = 0;
  relays.length = 0;
  bullets.length = 0;
  hitBursts.length = 0;
  deathBursts.length = 0;
  powerups.length = 0;
  gameTime = 0;
  initStars();

  for (let i = 0; i < CONFIG.relays.count; i++) {
    const relay = { x: 0, y: 0, active: true, respawn: 0 };
    spawnRelay(relay);
    relays.push(relay);
  }

  wave.timer = CONFIG.wave.interval;
  wave.active = false;
  wave.radius = 0;
  powerupTimer = 0;
}

function initGame(name, skin, shieldColor) {
  initWorld();
  players.length = 0;
  botRespawns.length = 0;
  resetTeamScores();
  resetHints();
  killCardTimer = 0;
  if (killCard) killCard.classList.remove("show");
  if (killPraise) killPraise.classList.remove("show");

  const localTeam = isTdmMode() ? "blue" : null;
  localPlayer = createPlayer(name, true, skin, shieldColor, localTeam);
  assignSpawn(localPlayer, null);
  players.push(localPlayer);
  for (let i = 0; i < getBotLimit(); i++) spawnBot();
}

const wave = {
  timer: CONFIG.wave.interval,
  active: false,
  radius: 0,
  origin: { x: CONFIG.world.w / 2, y: CONFIG.world.h / 2 },
};
const zoneFlash = {
  time: 0,
};
let powerupTimer = CONFIG.powerup.interval;

const baseHints = [
  { text: "WASD to drift. Left click fires laser bolts. Reload with R.", ttl: 12 },
  { text: "Right click deploys a bullet shield (3s, 10s cooldown).", ttl: 12 },
  { text: "Hold Space for Echo Rush (65% speed for 3s).", ttl: 14 },
  { text: "Stream zones charge a 5s zone energy boost (15s cooldown).", ttl: 12 },
  { text: "Grab diamond relays for a short tempo boost.", ttl: 12 },
  { text: "Pick up power cores for an 8s laser beam.", ttl: 12 },
  { id: "win", text: "", ttl: 12 },
  { text: "Hold Shift to brace (blocks damage, limited duration).", ttl: 12 },
];
const hints = baseHints.map((hint) => ({ ...hint }));

const defeatRoasts = [
  "Skill diff, respectfully.",
  "You got farmed for content.",
  "NPC moment.",
  "Touch drift, touch grass.",
  "That was free elo.",
  "Respawn speedrun any percent.",
  "Your aim said alt+F4.",
  "Main character? not today.",
  "Your shield went AFK.",
  "Ping is not your alibi.",
  "Uninstalling is a strategy.",
  "Built different, lost same.",
  "Zero kills, max cringe.",
  "You are feeding the leaderboard.",
  "Try aiming with your eyes open.",
  "You got 1v0'd.",
  "Your combo dropped harder than your frames.",
  "You played, the game played you.",
  "That was a highlight... for them.",
  "GGs (for them).",
  "Sadge. Very sadge.",
  "Did you queue for spectate?",
  "Spawned, sneezed, deleted.",
  "Bro got diffed by bots.",
  "This L is sponsored.",
  "You got ratio'd by the arena.",
];

const killPraises = [
  "Exellent.",
  "Sheesh.",
  "No diff.",
  "Main character energy.",
  "W.",
  "W combo.",
  "Too clean.",
  "On your grind.",
  "Clutched it.",
  "Unreal.",
  "Laser discipline.",
  "Cooked.",
  "Outplayed.",
  "Straight to highlights.",
  "Aim on point.",
  "Built different.",
  "Certified.",
  "Big brain.",
  "Respectfully deleted.",
  "That was cold.",
];

function resetHints() {
  hints.length = 0;
  for (const hint of baseHints) {
    if (hint.id === "win") {
      hints.push({ text: getModeHintText(), ttl: hint.ttl });
    } else {
      hints.push({ ...hint });
    }
  }
}

function randomRoast() {
  return defeatRoasts[Math.floor(Math.random() * defeatRoasts.length)];
}

function randomKillPraise(name) {
  const line = killPraises[Math.floor(Math.random() * killPraises.length)];
  return line;
}

function showKillCard(praiseText, killText) {
  if (!killCard && !killPraise) return;
  if (killCard) {
    killCard.textContent = killText || "";
    killCard.classList.add("show");
  }
  if (killPraise) {
    killPraise.textContent = praiseText || "";
    killPraise.classList.add("show");
  }
  killCardTimer = 2.4;
}

const audio = {
  ctx: null,
  master: null,
  sfxGain: null,
  musicGain: null,
  noise: null,
  musicTimer: null,
  musicEnabled: true,
  sfxEnabled: true,
  musicLevel: 0.052,
  sfxLevel: 0.55,
  lastHitSfx: 0,
  externalReady: false,
  externalSfx: {},
  musicTrack: null,
};

const SFX_FILES = {
  shot: "Sounds/Gun sound effect.wav",
  hit: "Sounds/Hit marker sound.wav",
  kill: "Sounds/Kill someone sound.wav",
  defeat: "Sounds/Get killed sound.mp3",
  click: "Sounds/Click Sound.mp3",
  powerup: "Sounds/power up sound effect.wav",
  beamOn: "Sounds/Laser beam gun.wav",
  reload: "Sounds/Relaod sound.wav",
  handShield: "Sounds/Hand shield sound.wav",
  rayShield: "Sounds/Main shield sound.wav",
  zoneFlash: "Sounds/zone sound effect.wav",
  rush: "Sounds/Speed sound.wav",
};
const MUSIC_FILE = "Sounds/Theme music.mp3";
const SFX_GAIN = {
  hit: 0.14,
  kill: 1.66,
  click: 0.45,
  shot: 0.48,
  reload: 0.85,
  handShield: 0.85,
  rayShield: 0.45,
  zoneFlash: 0.85,
};

function initAudio() {
  if (audio.ctx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.22;
  master.connect(ctx.destination);

  const sfxGain = ctx.createGain();
  sfxGain.gain.value = audio.sfxEnabled ? audio.sfxLevel : 0;
  sfxGain.connect(master);

  const musicGain = ctx.createGain();
  musicGain.gain.value = audio.musicEnabled ? audio.musicLevel : 0;
  musicGain.connect(master);

  audio.ctx = ctx;
  audio.master = master;
  audio.sfxGain = sfxGain;
  audio.musicGain = musicGain;
}

function initExternalAudio() {
  if (audio.externalReady) return;
  audio.externalReady = true;
  for (const [name, path] of Object.entries(SFX_FILES)) {
    const clip = new Audio(path);
    clip.preload = "auto";
    clip.volume = audio.sfxLevel;
    audio.externalSfx[name] = clip;
  }
  const music = new Audio(MUSIC_FILE);
  music.preload = "auto";
  music.loop = true;
  music.volume = audio.musicLevel;
  audio.musicTrack = music;
}

function ensureAudio() {
  if (!audio.ctx) initAudio();
  if (audio.ctx && audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
  initExternalAudio();
}

function playTone({
  freq = 440,
  freqEnd = null,
  type = "sine",
  duration = 0.12,
  gain = 0.1,
  attack = 0.01,
  bus = null,
}) {
  if (!audio.ctx) return;
  const ctx = audio.ctx;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);

  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(g);
  g.connect(bus || audio.sfxGain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + 0.02);
}

function playNoise({ duration = 0.2, gain = 0.08, lowpass = 1200, bus = null }) {
  if (!audio.ctx) return;
  const ctx = audio.ctx;
  if (!audio.noise) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    audio.noise = buffer;
  }
  const source = ctx.createBufferSource();
  source.buffer = audio.noise;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = lowpass;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  source.connect(filter);
  filter.connect(g);
  g.connect(bus || audio.sfxGain);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + duration + 0.02);
}

function startMusic() {
  if (!audio.musicEnabled) return;
  if (audio.musicTrack) {
    if (!audio.musicTrack.paused) return;
    if (audio.musicTimer) {
      clearInterval(audio.musicTimer);
      audio.musicTimer = null;
    }
    audio.musicTrack.volume = audio.musicLevel;
    audio.musicTrack
      .play()
      .then(() => {})
      .catch(() => {});
    return;
  }
  if (!audio.ctx || audio.musicTimer) return;
  const melody = [0, 3, 5, 7, 10, 7, 5, 3, 0, 3, 5, 7, 10, 12, 10, 7];
  const bass = [0, 0, 5, 0, 3, 0, 5, 0];
  let step = 0;
  audio.musicTimer = setInterval(() => {
    const base = 110;
    const m = melody[step % melody.length];
    const b = bass[step % bass.length];
    const freq = base * Math.pow(2, m / 12);
    const bassFreq = (base * 0.5) * Math.pow(2, b / 12);

    playTone({
      freq,
      freqEnd: freq * 1.02,
      type: "triangle",
      duration: 0.32,
      gain: 0.07,
      attack: 0.02,
      bus: audio.musicGain,
    });

    playTone({
      freq: bassFreq,
      freqEnd: bassFreq * 0.98,
      type: "sine",
      duration: 0.38,
      gain: 0.08,
      attack: 0.01,
      bus: audio.musicGain,
    });

    if (step % 4 === 0) {
      playNoise({ duration: 0.08, gain: 0.05, lowpass: 1200, bus: audio.musicGain });
    }
    if (step % 8 === 4) {
      playNoise({ duration: 0.12, gain: 0.08, lowpass: 300, bus: audio.musicGain });
    }

    step += 1;
  }, 380);
}

function setMusicEnabled(enabled) {
  audio.musicEnabled = enabled;
  if (audio.musicTrack) {
    audio.musicTrack.volume = enabled ? audio.musicLevel : 0;
    if (enabled) {
      startMusic();
    } else {
      audio.musicTrack.pause();
      audio.musicTrack.currentTime = 0;
    }
  }
  if (!audio.ctx) return;
  audio.musicGain.gain.value = enabled ? audio.musicLevel : 0;
  if (enabled) {
    startMusic();
  } else if (audio.musicTimer) {
    clearInterval(audio.musicTimer);
    audio.musicTimer = null;
  }
}

function setSfxEnabled(enabled) {
  audio.sfxEnabled = enabled;
  if (!audio.ctx) return;
  audio.sfxGain.gain.value = enabled ? audio.sfxLevel : 0;
}

function playSfx(name) {
  if (!audio.sfxEnabled) return;
  if (name === "rushLoop" && audio.externalSfx.rush) return;
  if (audio.externalSfx[name]) {
    const clip = audio.externalSfx[name].cloneNode();
    const gainMult = SFX_GAIN[name] ?? 1;
    clip.volume = audio.sfxLevel * gainMult;
    clip.play().catch(() => {});
    return;
  }
  if (!audio.ctx) return;
  switch (name) {
    case "shot":
      playTone({ freq: 820, freqEnd: 420, type: "sawtooth", duration: 0.09, gain: 0.12 });
      break;
    case "reload":
      playTone({ freq: 240, freqEnd: 360, type: "square", duration: 0.12, gain: 0.08 });
      break;
    case "rayShield":
      playTone({ freq: 300, freqEnd: 680, type: "triangle", duration: 0.2, gain: 0.1 });
      break;
    case "handShield":
      playTone({ freq: 180, freqEnd: 260, type: "sine", duration: 0.18, gain: 0.08 });
      break;
    case "shieldBlock":
      playTone({ freq: 500, freqEnd: 300, type: "square", duration: 0.06, gain: 0.08 });
      break;
    case "rush":
      playTone({ freq: 260, freqEnd: 620, type: "triangle", duration: 0.22, gain: 0.1 });
      playTone({ freq: 520, freqEnd: 860, type: "sine", duration: 0.14, gain: 0.08 });
      break;
    case "rushLoop":
      playNoise({ duration: 0.12, gain: 0.05, lowpass: 900 });
      playTone({ freq: 180, freqEnd: 260, type: "sine", duration: 0.12, gain: 0.04 });
      break;
    case "hit":
      playTone({
        freq: 680,
        freqEnd: 520,
        type: "square",
        duration: 0.05,
        gain: 0.06 * (SFX_GAIN.hit ?? 1),
      });
      break;
    case "kill":
      playTone({ freq: 520, freqEnd: 980, type: "triangle", duration: 0.14, gain: 0.12 });
      playTone({ freq: 260, freqEnd: 420, type: "sawtooth", duration: 0.12, gain: 0.08 });
      break;
    case "powerup":
      playTone({ freq: 420, freqEnd: 700, type: "triangle", duration: 0.2, gain: 0.12 });
      playTone({ freq: 840, freqEnd: 560, type: "sine", duration: 0.16, gain: 0.08 });
      break;
    case "beamOn":
      playNoise({ duration: 0.25, gain: 0.08, lowpass: 1800 });
      playTone({ freq: 260, freqEnd: 520, type: "sine", duration: 0.22, gain: 0.1 });
      break;
    case "wave":
      playNoise({ duration: 0.35, gain: 0.1, lowpass: 900 });
      playTone({ freq: 120, freqEnd: 80, type: "sine", duration: 0.3, gain: 0.1 });
      break;
    case "defeat":
      playTone({ freq: 420, freqEnd: 90, type: "sawtooth", duration: 0.35, gain: 0.14 });
      playTone({ freq: 180, freqEnd: 140, type: "triangle", duration: 0.2, gain: 0.1 });
      playNoise({ duration: 0.12, gain: 0.08, lowpass: 700 });
      break;
    case "victory":
      playTone({ freq: 220, freqEnd: 440, type: "triangle", duration: 0.35, gain: 0.12 });
      playTone({ freq: 330, freqEnd: 660, type: "sine", duration: 0.35, gain: 0.08 });
      break;
    default:
      break;
  }
}

function addHint(text, ttl = 6) {
  hints.push({ text, ttl });
}

function updateHints(dt) {
  for (const hint of hints) hint.ttl -= dt;
  for (let i = hints.length - 1; i >= 0; i--) {
    if (hints[i].ttl <= 0) hints.splice(i, 1);
  }
  uiHints.innerHTML = hints
    .slice(0, 3)
    .map((hint) => `<div class="hint">${hint.text}</div>`)
    .join("");
}

function applyInput(player, dt) {
  let ax = 0;
  let ay = 0;
  if (input.move.active) {
    ax = input.move.x;
    ay = input.move.y;
  } else {
    if (input.keys["w"]) ay -= 1;
    if (input.keys["s"]) ay += 1;
    if (input.keys["a"]) ax -= 1;
    if (input.keys["d"]) ax += 1;
  }
  let mag = Math.hypot(ax, ay);
  if (mag > 1) {
    ax /= mag;
    ay /= mag;
    mag = 1;
  }
  const dir = mag ? { x: ax / mag, y: ay / mag } : { x: 0, y: 0 };
  player.braceRequest = Boolean(
    input.keys["shift"] || input.keys["shiftleft"] || input.keys["shiftright"]
  );

  player.rushRequest = Boolean(input.keys["space"]);

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

  let aimDir = null;
  if (input.aim.active) {
    aimDir = normalize(input.aim.x, input.aim.y);
  } else {
    const mouseWorld = screenToWorld(input.mouse.x, input.mouse.y);
    aimDir = normalize(mouseWorld.x - player.x, mouseWorld.y - player.y);
  }
  player.aim = aimDir;
  player.shooting = input.mouse.down && player.energy > 2;
  player.firing = input.mouse.rightDown && player.energy > 2;
}

function applyAI(player, dt) {
  const maxHealth = getMaxHealth(player.energy);
  const healthRatio = player.health / maxHealth;
  const hillLeader = isHillMode() ? getHillLeader() : null;
  const hillAggro = hillLeader && hillLeader !== player;
  const hillLeaderDist = hillAggro ? dist(hillLeader, player) : Infinity;
  const hillMode = isHillMode();
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
  for (const other of players) {
    if (other === player) continue;
    if (isTdmMode() && player.team && other.team && player.team === other.team) continue;
    const d = dist(other, player);
    if (d < threatDist) {
      threat = other;
      threatDist = d;
    }
  }
  if (hillAggro && hillLeaderDist < 900) {
    const hillAggroChance = clamp(0.6 * aggroMult, 0.1, 0.95);
    if (hillLeaderDist < threatDist * 0.8 || Math.random() < hillAggroChance) {
      threat = hillLeader;
      threatDist = hillLeaderDist;
    }
  }

  if (player.ai.fire <= 0) {
    const shootBias = hillAggro && threat && threat.id === hillLeader.id ? 0.18 : 0;
    const baseShoot = (hillMode ? 0.9 : 0.84) * aggroMult;
    const tunedBias = shootBias * aggroMult;
    const willShoot = Math.random() < clamp(baseShoot + tunedBias, 0.05, 0.95);
    player.ai.fire = (willShoot ? randRange(0.18, 0.4) : randRange(0.2, 0.5)) * reactionMult;
    player.ai.fireMode = willShoot;
  } else {
    player.ai.fire -= dt;
  }

  if (player.ai.shieldRest > 0) {
    player.ai.shieldRest = Math.max(0, player.ai.shieldRest - dt);
  }

  const streamCamper = nearestStreamCamper(player, player);
  const streamThreat =
    streamCamper.target && streamCamper.dist < 900 ? streamCamper.target : null;

  let powerTarget = null;
  let powerDist = Infinity;
  if (player.laserTime <= 0) {
    for (const powerup of powerups) {
      const d = dist(powerup, player);
      if (d < powerDist) {
        powerTarget = powerup;
        powerDist = d;
      }
    }
  }

  let target = null;
  if (!player.inStream && player.streamBoostTime <= 0 && player.streamCooldown <= 0) {
    const streamTarget = nearestStreamZone(player);
    if (streamTarget && Math.random() < 0.35 * streamChanceMult) {
      target = streamTarget;
    }
  }
  if (healthRatio < 0.35 * fleeHealthMult && threat) {
    const away = normalize(player.x - threat.x, player.y - threat.y);
    target = {
      x: clamp(player.x + away.x * 260, 0, CONFIG.world.w),
      y: clamp(player.y + away.y * 260, 0, CONFIG.world.h),
    };
  } else if (!target && hillAggro && hillLeaderDist < 1400 * threatRangeMult && healthRatio > 0.4) {
    target = { x: hillLeader.x, y: hillLeader.y };
  } else if (!target && streamThreat && healthRatio > 0.4) {
    target = { x: streamThreat.x, y: streamThreat.y };
  } else if (!target && healthRatio < 0.55 && glimmerZone) {
    target = { x: glimmerZone.x, y: glimmerZone.y };
  } else if (!target && powerTarget) {
    target = { x: powerTarget.x, y: powerTarget.y };
  } else if (!target && threat && threatDist < 520 * threatRangeMult) {
    target = { x: threat.x, y: threat.y };
  } else if (!target) {
    player.ai.retarget -= dt;
    if (player.ai.retarget <= 0) {
      player.ai.retarget = (hillMode ? randRange(0.6, 1.4) : randRange(0.8, 2.0)) * reactionMult;
      const motif = motifs[Math.floor(Math.random() * motifs.length)];
      if (motif) {
        player.ai.target = { x: motif.x, y: motif.y };
      } else {
        player.ai.target = { x: randRange(0, CONFIG.world.w), y: randRange(0, CONFIG.world.h) };
      }
    }
    target = player.ai.target;
  }

  let ax = target.x - player.x;
  let ay = target.y - player.y;
  let distToTarget = Math.hypot(ax, ay);
  if (distToTarget < 60) {
    target = { x: randRange(0, CONFIG.world.w), y: randRange(0, CONFIG.world.h) };
    ax = target.x - player.x;
    ay = target.y - player.y;
    distToTarget = Math.hypot(ax, ay);
  }

  const dir = normalize(ax, ay);
  const mass = 1 + player.energy * 0.00005;
  const energyBoost = getEnergyBoost(player.energy);
  const rushMult = player.rushActive ? CONFIG.surge.speedMult : 1;
  const tempoMult = player.tempoTime > 0 ? CONFIG.tempo.speedMult : 1;
  const braceActive =
    player.braceRequest && player.braceCooldown <= 0 && player.braceTime > 0;
  const braceMult = braceActive ? CONFIG.brace.speedMult : 1;
  const accel =
    (CONFIG.player.accel * speedMult * energyBoost * rushMult * tempoMult * braceMult) / mass;
  player.vx += dir.x * accel * dt;
  player.vy += dir.y * accel * dt;

  if (player.braceCooldown <= 0 && player.braceTime > 0) {
    const braceDist = 220 * braceDistMult;
    const braceHealth = 0.4 * braceHealthMult;
    if (wave.active || (threat && (threatDist < braceDist || healthRatio < braceHealth))) {
      if (player.ai.braceIntent <= 0) {
        player.ai.braceIntent = randRange(0.8, 1.4) * braceTimeMult;
      }
    } else if (player.ai.braceIntent <= 0) {
      player.ai.braceIntent = 0;
    }
  } else {
    player.ai.braceIntent = 0;
  }

  player.braceRequest = player.ai.braceIntent > 0;

  if (player.surgeCooldown <= 0) {
    const chase = threat && threatDist > 300 && healthRatio > 0.55;
    const escape = threat && threatDist < 260 && healthRatio < 0.45;
    const grabPower = powerTarget && !threat;
    const rushChance = clamp((hillMode ? 0.6 : 0.5) * rushChanceMult, 0, 0.95);
    player.rushRequest = (chase || escape || grabPower) && Math.random() < rushChance;
  } else {
    player.rushRequest = false;
  }

  if (threat) {
    const aimDir = normalize(threat.x - player.x, threat.y - player.y);
    const cos = Math.cos(player.ai.aimJitter);
    const sin = Math.sin(player.ai.aimJitter);
    player.aim = {
      x: aimDir.x * cos - aimDir.y * sin,
      y: aimDir.x * sin + aimDir.y * cos,
    };
    const wasShielding = player.firing;
    const shieldStartCharge = CONFIG.pulseShield.maxCharge * shieldStartFrac;
    const shieldStopCharge = CONFIG.pulseShield.maxCharge * shieldStopFrac;
    const incomingFire = threat.shooting || threat.laserTime > 0;
    const threatPressure =
      (incomingFire && threatDist < 380 * threatRangeMult) ||
      threatDist < 200 * threatRangeMult ||
      healthRatio < 0.42 ||
      player.reloading;
    if (player.ai.shieldIntent > 0) {
      player.ai.shieldIntent = Math.max(0, player.ai.shieldIntent - dt);
      if (player.shieldCharge <= shieldStopCharge) {
        player.ai.shieldIntent = 0;
      }
    } else if (
      player.ai.shieldRest <= 0 &&
      player.shieldCharge >= shieldStartCharge &&
      (incomingFire || threatPressure)
    ) {
      player.ai.shieldIntent = randRange(0.25, 0.65) * shieldHoldMult;
    }
    player.firing = player.ai.shieldIntent > 0 && player.shieldCharge > 0;
    if (wasShielding && !player.firing) {
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
    player.aim = dir;
    player.ai.shieldIntent = 0;
    player.firing = false;
    player.shooting = false;
  }

  if (player.isBot) {
    const shieldActive = player.firing && player.shieldCharge > 0;
    if (shieldActive) {
      if (!player.shieldTargetId) {
        player.shieldTargetId = threat ? threat.id : null;
      }
      let shieldTarget = null;
      if (player.shieldTargetId) {
        shieldTarget = players.find((p) => p.id === player.shieldTargetId) || null;
      }
      if (!shieldTarget && threat) {
        player.shieldTargetId = threat.id;
        shieldTarget = threat;
      }
      if (shieldTarget) {
        const aimDir = normalize(shieldTarget.x - player.x, shieldTarget.y - player.y);
        if (!player.shieldAim) player.shieldAim = { ...aimDir };
        const blend = 0.22;
        const ax = player.shieldAim.x + (aimDir.x - player.shieldAim.x) * blend;
        const ay = player.shieldAim.y + (aimDir.y - player.shieldAim.y) * blend;
        player.shieldAim = normalize(ax, ay);
        player.aim = player.shieldAim;
      }
    } else {
      player.shieldAim = null;
      player.shieldTargetId = null;
    }
  }

  if (!player.reloading) {
    if (player.ammo === 0 || (player.ammo <= 3 && (!threat || threatDist > 360))) {
      player.reloading = true;
      player.reloadTime = CONFIG.ammo.reloadTime;
    }
  }
}

function updatePlayer(player, dt) {
  if (player.isLocal) {
    applyInput(player, dt);
  } else {
    applyAI(player, dt);
  }

  if (player.isLocal && damagePulse > 0) {
    damagePulse = Math.max(0, damagePulse - dt * 1.1);
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
    const wasBracing = player.bracing;
    player.bracing = true;
    player.braceTime -= dt;
    if (!wasBracing && player.isLocal) playSfx("handShield");
    if (player.braceTime <= 0) {
      player.braceTime = 0;
      player.bracing = false;
      player.braceCooldown = CONFIG.brace.cooldown;
    }
  } else {
    player.bracing = false;
  }

  if (!player.isLocal && player.ai) {
    if (player.braceCooldown > 0 || player.braceTime <= 0) {
      player.ai.braceIntent = 0;
    } else if (player.ai.braceIntent > 0) {
      player.ai.braceIntent -= dt;
    }
  }

  if (player.reloadTime <= 0 && player.reloading) {
    player.reloading = false;
    player.ammo = CONFIG.ammo.max;
  }

  if (player.isLocal && input.keys["r"] && !player.reloading && player.ammo < CONFIG.ammo.max) {
    player.reloading = true;
    player.reloadTime = CONFIG.ammo.reloadTime;
    playSfx("reload");
  }

  const wasShieldActive = player.shieldActive;
  player.shieldActive = player.firing && player.shieldCharge > 0;
  if (player.shieldActive) {
    player.shieldCharge = Math.max(
      0,
      player.shieldCharge - CONFIG.pulseShield.drainPerSec * dt
    );
    if (player.shieldCharge <= 0) player.shieldActive = false;
    if (!wasShieldActive && player.isLocal) playSfx("rayShield");
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
    if (player.isLocal) playSfx("rush");
  }

  if (player.isLocal) {
    if (player.rushActive) {
      player.rushSfxTimer -= dt;
      if (player.rushSfxTimer <= 0) {
        playSfx("rushLoop");
        player.rushSfxTimer = 0.45;
      }
    } else {
      player.rushSfxTimer = 0;
    }
  }

  if (player.shooting && player.laserTime <= 0) tryFireGun(player);

  const zone = zoneAt(player.x, player.y);
  const inStream = zone && zone.type === "stream";
  if (inStream && player.streamCooldown <= 0 && player.streamBoostTime <= 0) {
    player.streamBoostTime = CONFIG.streamBoost.duration;
    if (player.isLocal) addHint("Zone Energy Boost: 2x for 5s.", 3);
  }
  player.inStream = Boolean(inStream);

  if (zone) {
    if (zone.type === "stream") {
      player.vx += zone.dir.x * zone.current * dt;
      player.vy += zone.dir.y * zone.current * dt;
    }
    if (zone.hazard) {
      applyDamage(player, zone.hazard * dt * 2.03);
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

  // Normalize per-frame damping to a 60fps baseline.
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
  if (player.trailTimer >= CONFIG.trail.interval || moved > CONFIG.trail.minDist) {
    player.trailTimer = 0;
    player.lastTrail.x = player.x;
    player.lastTrail.y = player.y;
    const zoneHere = zoneAt(player.x, player.y);
    const tempoMult = player.tempoTime > 0 ? CONFIG.tempo.trailMult : 1;
    const surgeHot = false;
    const ttlBase = zoneHere && zoneHere.trailTtl ? zoneHere.trailTtl : CONFIG.trail.baseTtl;
    const ttl = surgeHot ? Math.min(ttlBase, CONFIG.trail.surgeTtl) : ttlBase;
    trailSegments.push({
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
  if (!isEnergyMode() && player.energy > CONFIG.maxEnergyOtherModes) {
    player.energy = CONFIG.maxEnergyOtherModes;
  }
  const maxHealth = getMaxHealth(player.energy);
  if (gameTime - player.lastDamageTime > CONFIG.health.regenDelay) {
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

function updateWave(dt) {
  wave.timer -= dt;
  if (wave.timer <= 0 && !wave.active) {
    wave.active = true;
    wave.radius = 0;
    wave.timer = CONFIG.wave.interval;
    addHint("Surge flash inbound. Brace with Shift.", 4);
    playSfx("wave");
    playSfx("zoneFlash");
    zoneFlash.time = CONFIG.zoneFlash.duration;
  }

  if (!wave.active) return;
  wave.radius += CONFIG.wave.speed * dt;
  const maxR = Math.hypot(CONFIG.world.w, CONFIG.world.h);
  if (wave.radius > maxR + CONFIG.wave.width) {
    wave.active = false;
  }

  for (const player of players) {
    const dx = player.x - wave.origin.x;
    const dy = player.y - wave.origin.y;
    const d = Math.hypot(dx, dy);
    if (Math.abs(d - wave.radius) < CONFIG.wave.width) {
      if (player.bracing) continue;
      const dir = normalize(dx, dy);
      player.vx += dir.x * CONFIG.wave.knock * dt;
      player.vy += dir.y * CONFIG.wave.knock * dt;
      applyDamage(player, CONFIG.wave.damage * dt);
    }
  }
}

function tryFireGun(player) {
  if (player.gunCooldown > 0) return;
  if (player.energy < CONFIG.laserGun.energyCost) return;
  if (player.reloading || player.ammo <= 0) return;
  player.energy -= CONFIG.laserGun.energyCost;
  player.gunCooldown = CONFIG.laserGun.cooldown;
  player.ammo -= 1;
  player.shotsFired += 1;
  if (player.isLocal) playSfx("shot");

  const spread = player.tempoTime > 0 ? 0.02 : 0.04;
  const baseAngle = Math.atan2(player.aim.y, player.aim.x);
  const angle = baseAngle + randRange(-spread, spread);
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  const startX = player.x + dir.x * (player.radius + 6);
  const startY = player.y + dir.y * (player.radius + 6);

  bullets.push({
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

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.ttl -= dt;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    const owner = players.find((p) => p.id === bullet.ownerId) || null;

    if (
      bullet.ttl <= 0 ||
      bullet.x < -50 ||
      bullet.y < -50 ||
      bullet.x > CONFIG.world.w + 50 ||
      bullet.y > CONFIG.world.h + 50
    ) {
      bullets.splice(i, 1);
      continue;
    }

    for (const target of players) {
      if (target.id === bullet.ownerId) continue;
      if (
        isTdmMode() &&
        owner &&
        owner.team &&
        target.team &&
        owner.team === target.team
      ) {
        continue;
      }
      if (target.shieldActive) {
        const sx = bullet.x - target.x;
        const sy = bullet.y - target.y;
        const dist = Math.hypot(sx, sy);
        const range = getShieldRange(target);
        if (dist < range) {
          const dir = normalize(sx, sy);
          const dot = dir.x * target.aim.x + dir.y * target.aim.y;
          if (dot > Math.cos(CONFIG.pulseShield.cone)) {
            hitBursts.push({ x: bullet.x, y: bullet.y, ttl: CONFIG.hit.ttl });
            if (target.isLocal) playSfx("shieldBlock");
            playHitMarker(owner);
            playHitMarker(target);
            const damage = CONFIG.laserGun.damage;
            const absorbed = Math.min(target.shieldCharge, damage);
            target.shieldCharge = Math.max(0, target.shieldCharge - absorbed);
            if (target.shieldCharge <= 0) target.shieldActive = false;
            if (absorbed < damage) {
              applyDamage(target, damage - absorbed, owner);
            }
            bullets.splice(i, 1);
            break;
          }
        }
      }
      const dx = target.x - bullet.x;
      const dy = target.y - bullet.y;
      const hitRadius = target.radius + 4;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        if (target.bracing) {
          hitBursts.push({ x: bullet.x, y: bullet.y, ttl: CONFIG.hit.ttl });
          playHitMarker(owner);
          playHitMarker(target);
          bullets.splice(i, 1);
          break;
        }
        const damage = CONFIG.laserGun.damage;
        if (owner) owner.shotsHit += 1;
        applyDamage(target, damage, owner);
        target.vx += (bullet.vx / CONFIG.laserGun.speed) * CONFIG.laserGun.knock;
        target.vy += (bullet.vy / CONFIG.laserGun.speed) * CONFIG.laserGun.knock;
        hitBursts.push({ x: bullet.x, y: bullet.y, ttl: CONFIG.hit.ttl });

        bullets.splice(i, 1);
        break;
      }
    }
  }
}

function updateLaserBeam(dt) {
  for (const attacker of players) {
    if (!attacker.shooting || attacker.laserTime <= 0) continue;
    attacker.energy -= CONFIG.laserBeam.energyCostPerSec * dt;
    if (attacker.energy <= 0) continue;

    const ax = attacker.x;
    const ay = attacker.y;
    const dir = attacker.aim;
    for (const target of players) {
      if (target === attacker) continue;
      if (
        isTdmMode() &&
        attacker.team &&
        target.team &&
        attacker.team === target.team
      ) {
        continue;
      }
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
      applyDamage(target, damage, attacker);
      target.vx += dir.x * CONFIG.laserBeam.knock * dt;
      target.vy += dir.y * CONFIG.laserBeam.knock * dt;
      hitBursts.push({ x: target.x, y: target.y, ttl: CONFIG.hit.ttl });
    }
  }
}

function updateMotifs(dt) {
  while (motifs.length < CONFIG.motifs.target) spawnMotif();

  for (let i = motifs.length - 1; i >= 0; i--) {
    const motif = motifs[i];
    for (const player of players) {
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
        motifs.splice(i, 1);
        break;
      }
    }
  }
}

function spawnPowerup() {
  const candidates = zones.filter((zone) => zone.type !== "stream");
  const zone = candidates[Math.floor(Math.random() * candidates.length)];
  const pos = randomPointInZone(zone);
  powerups.push({ x: pos.x, y: pos.y });
}

function updatePowerups(dt) {
  powerupTimer -= dt;
  if (powerupTimer <= 0) {
    while (powerups.length < CONFIG.powerup.count) spawnPowerup();
    powerupTimer = CONFIG.powerup.interval;
  }

  for (let i = powerups.length - 1; i >= 0; i--) {
    const powerup = powerups[i];
    for (const player of players) {
      const dx = player.x - powerup.x;
      const dy = player.y - powerup.y;
      if (dx * dx + dy * dy < (player.radius + 14) * (player.radius + 14)) {
        player.laserTime = CONFIG.powerup.duration;
        powerups.splice(i, 1);
        if (player.isLocal) {
          playSfx("powerup");
          playSfx("beamOn");
        }
        if (player.isLocal) addHint("Power core online. Laser beam active.", 3);
        break;
      }
    }
  }
}

function updateTrails(dt) {
  for (let i = trailSegments.length - 1; i >= 0; i--) {
    const seg = trailSegments[i];
    seg.ttl -= dt;
    if (seg.ttl <= 0) {
      trailSegments.splice(i, 1);
      continue;
    }

    for (const player of players) {
      const dx = player.x - seg.x;
      const dy = player.y - seg.y;
      if (dx * dx + dy * dy < CONFIG.trail.harvestRange * CONFIG.trail.harvestRange) {
        if (!canGainEnergy(player)) continue;
        const owner = players.find((p) => p.id === seg.ownerId);
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
        trailSegments.splice(i, 1);
        break;
      }
    }
  }
}

function updateRelays(dt) {
  for (const relay of relays) {
    if (!relay.active) {
      relay.respawn -= dt;
      if (relay.respawn <= 0) spawnRelay(relay);
      continue;
    }
    for (const player of players) {
      const dx = player.x - relay.x;
      const dy = player.y - relay.y;
      if (dx * dx + dy * dy < 28 * 28) {
        player.tempoTime = CONFIG.tempo.duration;
        relay.active = false;
        relay.respawn = CONFIG.relays.respawn;
        if (player.isLocal) addHint("Relay captured. Trails surge for a moment.", 3);
        break;
      }
    }
  }
}

function updateHitBursts(dt) {
  for (let i = hitBursts.length - 1; i >= 0; i--) {
    hitBursts[i].ttl -= dt;
    if (hitBursts[i].ttl <= 0) hitBursts.splice(i, 1);
  }
}

function spawnDeathEffect(player) {
  const shards = [];
  for (let i = 0; i < CONFIG.deathEffect.shardCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randRange(CONFIG.deathEffect.shardSpeed * 0.4, CONFIG.deathEffect.shardSpeed);
    shards.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: randRange(2, 4),
    });
  }
  deathBursts.push({
    x: player.x,
    y: player.y,
    color: player.color,
    ttl: CONFIG.deathEffect.duration,
    ttlMax: CONFIG.deathEffect.duration,
    ring: Math.max(12, player.radius * 0.8),
    shards,
  });
}

function updateDeathBursts(dt) {
  for (let i = deathBursts.length - 1; i >= 0; i--) {
    const burst = deathBursts[i];
    burst.ttl -= dt;
    burst.ring += CONFIG.deathEffect.ringSpeed * dt;
    for (const shard of burst.shards) {
      shard.x += shard.vx * dt;
      shard.y += shard.vy * dt;
      shard.vx *= 0.96;
      shard.vy *= 0.96;
    }
    if (burst.ttl <= 0) deathBursts.splice(i, 1);
  }
}

function respawn(player) {
  const avoid = player.isLocal ? null : localPlayer;
  assignSpawn(player, avoid);
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
  player.rushSfxTimer = 0;
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

function update(dt) {
  if (!gameActive) return;
  gameTime += dt;
  for (let i = botRespawns.length - 1; i >= 0; i--) {
    botRespawns[i] -= dt;
    if (botRespawns[i] <= 0) {
      spawnBot();
      botRespawns.splice(i, 1);
    }
  }
  for (const player of players) updatePlayer(player, dt);
  updateWave(dt);
  updateBullets(dt);
  updateLaserBeam(dt);
  updatePowerups(dt);
  updateTrails(dt);
  updateRelays(dt);
  updateHitBursts(dt);
  updateDeathBursts(dt);

  if (zoneFlash.time > 0) zoneFlash.time = Math.max(0, zoneFlash.time - dt);

  for (const player of players) {
    player.maxEnergy = Math.max(player.maxEnergy, player.energy);
  }

  if (isEnergyMode()) {
    const winner = players.find((player) => player.energy >= CONFIG.winEnergy);
    if (winner) {
      showMenu("Victory", "victory", getModeVictoryDetail(winner), buildPostMatchBreakdown(winner.name));
      return;
    }
  }

  for (let i = players.length - 1; i >= 0; i--) {
    const player = players[i];
    if (player.health <= 0) {
      player.deaths += 1;
      player.killStreak = 0;
      if (isHillMode()) player.kills = 0;
      let killerName = "Arena";
      if (player.lastHitBy && gameTime - player.lastHitTime <= CONFIG.kill.window) {
        const killer = players.find((p) => p.id === player.lastHitBy);
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
            if (
              isTdmMode() &&
              killer.team &&
              player.team &&
              killer.team !== player.team
            ) {
              teamScores[killer.team] += 1;
            }
            const heal = getMaxHealth(killer.energy) * 0.25;
            killer.health = Math.min(killer.health + heal, getMaxHealth(killer.energy));
            if (killer.isLocal) {
              playSfx("kill");
              showKillCard(randomKillPraise(player.name), `Eliminated ${player.name}`);
            }
          }
      }

      spawnDeathEffect(player);
      if (player.isLocal) {
        if (isHillMode() || isTdmMode()) {
          respawn(player);
          continue;
        }
        showMenu("Defeated", "defeat", randomRoast(), buildPostMatchBreakdown(killerName));
        return;
      }
      if (player.isBot) {
        botRespawns.push(BOT_RESPAWN_DELAY);
        players.splice(i, 1);
        continue;
      }
      respawn(player);
    }
  }

  if (isKillMode()) {
    const winner = players.find((player) => player.kills >= CONFIG.winKills);
    if (winner) {
      showMenu("Victory", "victory", getModeVictoryDetail(winner), buildPostMatchBreakdown(winner.name));
      return;
    }
  }

  if (isTdmMode()) {
    const reachedLimit =
      teamScores.red >= CONFIG.winTeamKills || teamScores.blue >= CONFIG.winTeamKills;
    if (reachedLimit) {
      const winnerTeam = teamScores.red === teamScores.blue ? null : getTeamWinner();
      if (winnerTeam) {
        const localWon = localPlayer && localPlayer.team === winnerTeam;
        showMenu(
          `${getTeamLabel(winnerTeam)} Wins!`,
          localWon ? "victory" : "defeat",
          `${getTeamLabel(winnerTeam)} Wins!`,
          buildPostMatchBreakdown(getTeamLabel(winnerTeam))
        );
        return;
      }
    }
    if (gameTime >= TDM_DURATION) {
      const winnerTeam = getTeamWinner();
      if (winnerTeam) {
        const localWon = localPlayer && localPlayer.team === winnerTeam;
        showMenu(
          `${getTeamLabel(winnerTeam)} Wins!`,
          localWon ? "victory" : "defeat",
          `${getTeamLabel(winnerTeam)} Wins!`,
          buildPostMatchBreakdown(getTeamLabel(winnerTeam))
        );
        return;
      }
      showMenu("Match Over", "defeat", "Tie Game", buildPostMatchBreakdown("Tie Game"));
      return;
    }
  }

  if (isHillMode() && gameTime >= HILL_DURATION) {
    const winner = getHillLeader();
    if (winner) {
      const localWon = Boolean(winner.isLocal);
      const detail = localWon ? getModeVictoryDetail(winner) : randomRoast();
      showMenu(
        localWon ? "Victory" : "Match Over",
        localWon ? "victory" : "defeat",
        detail,
        buildPostMatchBreakdown(winner.name)
      );
      return;
    }
  }

  updateHints(dt);
  if (killCardTimer > 0) {
    killCardTimer -= dt;
    if (killCardTimer <= 0 && killCard) {
      killCard.classList.remove("show");
    }
    if (killCardTimer <= 0 && killPraise) {
      killPraise.classList.remove("show");
    }
  }
}

function screenToWorld(x, y) {
  const cam = camera();
  return { x: cam.x + (x - width / 2), y: cam.y + (y - height / 2) };
}

function camera() {
  if (!localPlayer) {
    return { x: CONFIG.world.w / 2, y: CONFIG.world.h / 2 };
  }
  return { x: localPlayer.x, y: localPlayer.y };
}

function renderBackground(cam) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#0b1016");
  grad.addColorStop(0.6, "#0a0f15");
  grad.addColorStop(1, "#090b10");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const hazeA = ctx.createRadialGradient(
    width * 0.18,
    height * 0.2,
    0,
    width * 0.18,
    height * 0.2,
    Math.max(width, height) * 0.85
  );
  hazeA.addColorStop(0, "rgba(114, 230, 255, 0.14)");
  hazeA.addColorStop(0.5, "rgba(114, 230, 255, 0.06)");
  hazeA.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = hazeA;
  ctx.fillRect(0, 0, width, height);

  const hazeB = ctx.createRadialGradient(
    width * 0.86,
    height * 0.78,
    0,
    width * 0.86,
    height * 0.78,
    Math.max(width, height) * 0.9
  );
  hazeB.addColorStop(0, "rgba(255, 159, 122, 0.12)");
  hazeB.addColorStop(0.55, "rgba(255, 159, 122, 0.05)");
  hazeB.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = hazeB;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.25,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.95
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(4, 6, 10, 0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  ctx.translate(width / 2 - cam.x * 0.3, height / 2 - cam.y * 0.3);
  for (const star of stars) {
    const twinkle = 0.6 + 0.4 * Math.sin(gameTime * 0.8 + star.x * 0.002 + star.y * 0.002);
    ctx.globalAlpha = star.a * twinkle;
    ctx.fillStyle = `hsl(${Math.round(star.hue)}, 70%, 80%)`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);

  ctx.save();
  ctx.strokeStyle = "rgba(114, 230, 255, 0.08)";
  ctx.lineWidth = 1.4;
  ctx.setLineDash([18, 14]);
  const centerX = CONFIG.world.w / 2;
  const centerY = CONFIG.world.h / 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 320 + i * 180, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  const grid = 120;
  for (let x = 0; x <= CONFIG.world.w; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CONFIG.world.h);
    ctx.stroke();
  }
  for (let y = 0; y <= CONFIG.world.h; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CONFIG.world.w, y);
    ctx.stroke();
  }

  for (const zone of zones) {
    const tint = zone.tint || "#72e6ff";
    const outerAlpha = zone.shape === "rect" ? 0.1 : 0.12;
    const innerAlpha = zone.shape === "rect" ? 0.18 : 0.22;
    const innerScale = zone.shape === "rect" ? 0.78 : 0.72;
    ctx.save();
    ctx.fillStyle = colorWithAlpha(tint, outerAlpha);
    drawZoneBlob(zone, 1);
    ctx.fill();
    ctx.fillStyle = colorWithAlpha(tint, innerAlpha);
    drawZoneBlob(zone, innerScale);
    ctx.fill();
    ctx.strokeStyle = colorWithAlpha(tint, 0.32);
    ctx.lineWidth = 2;
    ctx.shadowColor = colorWithAlpha(tint, 0.35);
    ctx.shadowBlur = zone.shape === "rect" ? 12 : 16;
    drawZoneBlob(zone, 1);
    ctx.stroke();
    ctx.restore();
  }

  if (zoneFlash.time > 0) {
    const pulse = Math.sin((zoneFlash.time / CONFIG.zoneFlash.duration) * Math.PI);
    ctx.save();
    ctx.globalAlpha = pulse * CONFIG.zoneFlash.strength;
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    for (const zone of zones) {
      drawZoneBlob(zone, 1);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

function renderTrails(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const seg of trailSegments) {
    const owner = players.find((p) => p.id === seg.ownerId);
    const ttlBase = seg.ttlMax || (seg.hot ? CONFIG.trail.surgeTtl : CONFIG.trail.baseTtl);
    const fade = clamp(seg.ttl / ttlBase, 0.2, 1);
    ctx.fillStyle = owner ? owner.color : "#88c";
    ctx.globalAlpha = (seg.hot ? 0.7 : 0.45) * fade;
    ctx.beginPath();
    ctx.arc(seg.x, seg.y, seg.hot ? 6 + fade * 3 : 4 + fade * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function renderMotifs(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const motif of motifs) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(motif.x, motif.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function renderPowerups(cam, time) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const powerup of powerups) {
    const pulse = 1 + Math.sin(time * 4) * 0.2;
    ctx.save();
    ctx.translate(powerup.x, powerup.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(120, 200, 255, 0.12)";
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "rgba(255, 120, 120, 0.35)";
    ctx.beginPath();
    ctx.rect(-7, -7, 14, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 210, 210, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "rgba(255, 210, 210, 0.95)";
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(114, 230, 255, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function renderRelays(cam, time) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const relay of relays) {
    if (!relay.active) continue;
    const pulse = 1 + Math.sin(time * 3) * 0.2;
    ctx.save();
    ctx.translate(relay.x, relay.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 10);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(114, 230, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function renderCrown(x, y, size) {
  if (crownImage && crownImage.complete && crownImage.naturalWidth > 0) {
    const width = size * 2.4;
    const height = width * (crownImage.naturalHeight / crownImage.naturalWidth);
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.drawImage(crownImage, x - width / 2, y - height, width, height);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  const gold = "rgba(255, 214, 102, 0.96)";
  const edge = "rgba(255, 236, 190, 0.95)";
  ctx.fillStyle = gold;
  ctx.strokeStyle = edge;
  ctx.lineWidth = 1.6;

  const baseH = Math.max(3, size * 0.28);
  const spikeH = size * 0.9;
  const half = size;

  ctx.beginPath();
  ctx.moveTo(-half, 0);
  ctx.lineTo(-half * 0.75, -spikeH * 0.55);
  ctx.lineTo(-half * 0.3, -spikeH);
  ctx.lineTo(0, -spikeH * 0.6);
  ctx.lineTo(half * 0.3, -spikeH);
  ctx.lineTo(half * 0.75, -spikeH * 0.55);
  ctx.lineTo(half, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = edge;
  ctx.beginPath();
  ctx.roundRect(-half, 0, half * 2, baseH, baseH * 0.5);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(140, 90, 255, 0.85)";
  const gemY = -spikeH * 0.6;
  ctx.beginPath();
  ctx.arc(0, gemY, Math.max(2, size * 0.18), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderPlayers(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);

  const hillLeader = isHillMode() ? getHillLeader() : null;
  for (const player of players) {
    const glow = Math.max(6, Math.sqrt(player.energy) * 0.8);
    const skin = player.skin;
    const skinImg = skin && skin.type === "image" ? skinImages[skin.id] : null;
    const hasImage = skinImg && skinImg.complete && skinImg.naturalWidth > 0;
    const glowColor = (skin && (skin.accent || skin.color)) || player.color;
    const teamColor = isTdmMode() && player.team ? getTeamColor(player.team) : null;

    if (!hasImage) {
      ctx.beginPath();
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = glow;
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glow;
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(skinImg, -player.radius, -player.radius, player.radius * 2, player.radius * 2);
      ctx.restore();
    }

    if (teamColor) {
      ctx.save();
      ctx.strokeStyle = colorWithAlpha(teamColor, 0.75);
      ctx.lineWidth = 3;
      ctx.shadowColor = teamColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 3, 0, Math.PI * 2);
    ctx.stroke();

    const barWidth = Math.max(40, player.radius * 1.4);
    const barHeight = 5;
    const barX = player.x - barWidth / 2;
    const barY = player.y - player.radius - 20;
    const maxHealth = getMaxHealth(player.energy);
    const healthRatio = clamp(player.health / maxHealth, 0, 1);
    ctx.fillStyle = "rgba(10, 12, 18, 0.8)";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = `rgba(${Math.round(120 + 80 * (1 - healthRatio))}, ${Math.round(
      220 * healthRatio
    )}, 120, 0.9)`;
    ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);

    const nameSize = Math.round(Math.min(18, Math.max(14, 10 + player.radius * 0.06)));
    const nameY = player.y - player.radius - 28 - (nameSize - 12) * 0.5;

    if (hillLeader && player.id === hillLeader.id) {
      const crownSize = Math.max(12, Math.round(player.radius * 0.45));
      const crownY = nameY - crownSize - 6;
      renderCrown(player.x, crownY, crownSize);
    }

    if (player.bracing) {
      const shieldBase = player.handShieldColor || "#72e6ff";
      const shieldFill = colorWithAlpha(shieldBase, 0.08);
      const shieldStroke = colorWithAlpha(shieldBase, 0.45);
      const shieldPattern = colorWithAlpha(shieldBase, 0.18);
      const radius = player.radius + 8;
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = shieldFill;
      ctx.fill();
      ctx.strokeStyle = shieldStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.clip();
      ctx.strokeStyle = shieldPattern;
      ctx.lineWidth = 1;
      const hexR = Math.max(6, player.radius * 0.18);
      const hexH = Math.sqrt(3) * hexR;
      const hexX = hexR * 1.5;
      for (let x = -radius - hexR; x <= radius + hexR; x += hexX) {
        const col = Math.round(x / hexX);
        const yOffset = col % 2 ? hexH / 2 : 0;
        for (let y = -radius - hexH; y <= radius + hexH; y += hexH) {
          const yy = y + yOffset;
          if (Math.hypot(x, yy) > radius) continue;
          renderHex(ctx, x, yy, hexR);
        }
      }
      ctx.restore();
    }

    if (player.tempoTime > 0) {
      ctx.strokeStyle = "rgba(166, 255, 156, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${nameSize}px Palatino Linotype`;
    ctx.textAlign = "center";
    ctx.fillText(player.name, player.x, nameY);
  }

  ctx.restore();
}

function renderCombat(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const player of players) {
    if (!player.shieldActive) continue;
    const range = getShieldRange(player);
    const originX = player.x + player.aim.x * player.radius * 0.5;
    const originY = player.y + player.aim.y * player.radius * 0.5;
    const shieldColor = player.handShieldColor || "#72e6ff";
    const shieldFill = colorWithAlpha(shieldColor, 0.08);
    const shieldStroke = colorWithAlpha(shieldColor, 0.3);
    const shieldPattern = colorWithAlpha(shieldColor, 0.16);
    const cone = CONFIG.pulseShield.cone;

    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(Math.atan2(player.aim.y, player.aim.x));

    const innerRadius = Math.max(player.radius * 0.5, range * 0.24);
    ctx.beginPath();
    ctx.arc(0, 0, range, -cone, cone);
    ctx.arc(0, 0, innerRadius, cone, -cone, true);
    ctx.closePath();
    ctx.fillStyle = shieldFill;
    ctx.strokeStyle = shieldStroke;
    ctx.lineWidth = 2 + player.radius * 0.03;
    ctx.fill();
    ctx.stroke();

    ctx.clip();
    ctx.strokeStyle = shieldPattern;
    ctx.lineWidth = 1;
    const hexR = Math.max(6, player.radius * 0.18);
    const hexH = Math.sqrt(3) * hexR;
    const hexX = hexR * 1.5;
    for (let x = innerRadius; x <= range + hexR; x += hexX) {
      const col = Math.round(x / hexX);
      const yOffset = col % 2 ? hexH / 2 : 0;
      for (let y = -range; y <= range; y += hexH) {
        const yy = y + yOffset;
        renderHex(ctx, x, yy, hexR);
      }
    }
    ctx.restore();
  }
  ctx.restore();
}

function renderLaserBeam(cam, time) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const player of players) {
    if (!player.shooting || player.laserTime <= 0) continue;
    const startX = player.x;
    const startY = player.y;
    const endX = player.x + player.aim.x * CONFIG.laserBeam.range;
    const endY = player.y + player.aim.y * CONFIG.laserBeam.range;

    const pulse = 1 + Math.sin(time * 6) * 0.08;
    const glowWidth = CONFIG.laserBeam.width * 2.2 * pulse;
    const midWidth = CONFIG.laserBeam.width * 0.8 * pulse;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    ctx.strokeStyle = "rgba(255, 70, 70, 0.25)";
    ctx.lineWidth = glowWidth;
    ctx.shadowColor = "rgba(255, 90, 90, 0.7)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 140, 140, 0.55)";
    ctx.lineWidth = midWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 235, 235, 0.95)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 200, 200, 0.7)";
    ctx.beginPath();
    ctx.arc(endX, endY, 8 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

function renderBullets(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const bullet of bullets) {
    const tailX = bullet.x - (bullet.vx / CONFIG.laserGun.speed) * 16;
    const tailY = bullet.y - (bullet.vy / CONFIG.laserGun.speed) * 16;
    ctx.strokeStyle = "rgba(255, 120, 120, 0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(bullet.x, bullet.y);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 230, 230, 0.9)";
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function renderHitBursts(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const burst of hitBursts) {
    const fade = burst.ttl / CONFIG.hit.ttl;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * fade})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, 10 + (1 - fade) * 16, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function renderHex(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

function renderDeathBursts(cam) {
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  for (const burst of deathBursts) {
    const fade = clamp(burst.ttl / burst.ttlMax, 0, 1);
    ctx.strokeStyle = burst.color;
    ctx.globalAlpha = 0.6 * fade;
    ctx.lineWidth = 2 + (1 - fade) * 3;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.ring, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = burst.color;
    ctx.globalAlpha = 0.8 * fade;
    for (const shard of burst.shards) {
      ctx.beginPath();
      ctx.arc(shard.x, shard.y, shard.size * fade, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function renderWave(cam) {
  if (!wave.active) return;
  ctx.save();
  ctx.translate(width / 2 - cam.x, height / 2 - cam.y);
  ctx.strokeStyle = "rgba(114, 230, 255, 0.12)";
  ctx.lineWidth = CONFIG.wave.width * 2;
  ctx.beginPath();
  ctx.arc(wave.origin.x, wave.origin.y, wave.radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(114, 230, 255, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(wave.origin.x, wave.origin.y, wave.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function renderMinimap() {
  const size = MINIMAP_SIZE;
  minimapCtx.clearRect(0, 0, size, size);
  minimapCtx.fillStyle = "rgba(10, 14, 20, 0.8)";
  minimapCtx.fillRect(0, 0, size, size);

  const pad = 10;
  const scaleX = (size - pad * 2) / CONFIG.world.w;
  const scaleY = (size - pad * 2) / CONFIG.world.h;
  const scale = Math.min(scaleX, scaleY);

  minimapCtx.strokeStyle = "rgba(114, 230, 255, 0.35)";
  minimapCtx.lineWidth = 1;
  minimapCtx.strokeRect(pad, pad, CONFIG.world.w * scale, CONFIG.world.h * scale);

  if (wave.active) {
    const cx = pad + wave.origin.x * scale;
    const cy = pad + wave.origin.y * scale;
    const radius = wave.radius * scale;
    minimapCtx.save();
    minimapCtx.strokeStyle = "rgba(255, 160, 120, 0.85)";
    minimapCtx.lineWidth = Math.max(2, CONFIG.wave.width * 2 * scale);
    minimapCtx.beginPath();
    minimapCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    minimapCtx.stroke();
    minimapCtx.restore();
  }

  for (const powerup of powerups) {
    const x = pad + powerup.x * scale;
    const y = pad + powerup.y * scale;
    minimapCtx.save();
    minimapCtx.translate(x, y);
    minimapCtx.rotate(Math.PI / 4);
    minimapCtx.fillStyle = "rgba(255, 120, 120, 0.95)";
    minimapCtx.fillRect(-3, -3, 6, 6);
    minimapCtx.strokeStyle = "rgba(255, 210, 210, 0.9)";
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(-4.5, -4.5, 9, 9);
    minimapCtx.restore();

    minimapCtx.beginPath();
    minimapCtx.arc(x, y, 6, 0, Math.PI * 2);
    minimapCtx.strokeStyle = "rgba(255, 120, 120, 0.35)";
    minimapCtx.lineWidth = 1;
    minimapCtx.stroke();
  }

  const hillLeader = isHillMode() ? getHillLeader() : null;
  for (const player of players) {
    const x = pad + player.x * scale;
    const y = pad + player.y * scale;
    minimapCtx.fillStyle =
      isTdmMode() && player.team ? getTeamColor(player.team) : player.color;
    minimapCtx.beginPath();
    minimapCtx.arc(x, y, player.isLocal ? 3.5 : 2.2, 0, Math.PI * 2);
    minimapCtx.fill();
    if (player.isLocal) {
      minimapCtx.strokeStyle = "rgba(255,255,255,0.8)";
      minimapCtx.lineWidth = 1;
      minimapCtx.stroke();
    }
    if (hillLeader && player.id === hillLeader.id) {
      minimapCtx.strokeStyle = "rgba(255, 214, 102, 0.95)";
      minimapCtx.lineWidth = 1.5;
      minimapCtx.beginPath();
      minimapCtx.arc(x, y, player.isLocal ? 6 : 5, 0, Math.PI * 2);
      minimapCtx.stroke();
    }
  }
}

function renderUI() {
  if (!gameActive || !localPlayer) return;
  const maxHealth = getMaxHealth(localPlayer.energy);
  const healthText = `${Math.round(localPlayer.health)}/${Math.round(maxHealth)}`;
  const energyValue = formatNumber(localPlayer.energy);
  const energyText = isKillMode() || isHillMode() || isTdmMode()
    ? energyValue
    : `${energyValue}/${formatNumber(CONFIG.winEnergy)}`;
  const killsText = isKillMode()
    ? `${localPlayer.kills}/${CONFIG.winKills}`
    : `${localPlayer.kills}`;
  const showKills = isKillMode() || isHillMode() || isTdmMode();
  const timeText = isHillMode() ? formatTime(Math.max(0, HILL_DURATION - gameTime)) : "";
  const tdmTimeText = isTdmMode() ? formatTime(Math.max(0, TDM_DURATION - gameTime)) : "";
  const ammoText = localPlayer.reloading
    ? `Reload ${localPlayer.reloadTime.toFixed(1)}s`
    : `${localPlayer.ammo}/${CONFIG.ammo.max}`;
  const rushText =
    localPlayer.rushActive
      ? `Active ${localPlayer.surgeTime.toFixed(1)}s`
      : localPlayer.surgeCooldown > 0
        ? `CD ${localPlayer.surgeCooldown.toFixed(1)}s`
        : "Ready";
  const braceText =
    localPlayer.braceCooldown > 0
      ? `CD ${localPlayer.braceCooldown.toFixed(1)}s`
      : localPlayer.braceTime < CONFIG.brace.duration
        ? `Active ${localPlayer.braceTime.toFixed(1)}s`
        : "Ready";
  const shieldPercent = Math.round(
    clamp(localPlayer.shieldCharge / CONFIG.pulseShield.maxCharge, 0, 1) * 100
  );
  const rayText = localPlayer.shieldActive
    ? `Active ${shieldPercent}%`
    : `Charge ${shieldPercent}%`;
  const beamText = localPlayer.laserTime > 0 ? `${localPlayer.laserTime.toFixed(1)}s` : "";

  uiStats.innerHTML = `
    <div class="stat-chip"><span class="stat-label">HP</span><span class="stat-value">${healthText}</span></div>
    <div class="stat-chip"><span class="stat-label">Energy</span><span class="stat-value">${energyText}</span></div>
    ${showKills ? `<div class="stat-chip"><span class="stat-label">Kills</span><span class="stat-value">${killsText}</span></div>` : ""}
    ${isHillMode() ? `<div class="stat-chip"><span class="stat-label">Time</span><span class="stat-value">${timeText}</span></div>` : ""}
    <div class="stat-chip stat-ammo"><span class="stat-label">Ammo</span><span class="stat-value">${ammoText}</span></div>
    <div class="stat-chip"><span class="stat-label">Echo Rush</span><span class="stat-value">${rushText}</span></div>
    <div class="stat-chip"><span class="stat-label">Shield</span><span class="stat-value">${braceText}</span></div>
    <div class="stat-chip"><span class="stat-label">Ray Shield</span><span class="stat-value">${rayText}</span></div>
    ${beamText ? `<div class="stat-chip"><span class="stat-label">Beam</span><span class="stat-value stat-alert">${beamText}</span></div>` : ""}
  `;

  if (uiStats) {
    const statsHeight = uiStats.getBoundingClientRect().height;
    if (statsHeight && Math.abs(statsHeight - lastStatsHeight) > 0.5) {
      document.documentElement.style.setProperty("--stats-height", `${statsHeight}px`);
      lastStatsHeight = statsHeight;
    }
  }

  if (matchTimer) {
    if (isHillMode()) {
      matchTimer.textContent = `Time Left ${timeText}`;
      matchTimer.classList.add("show");
    } else if (isTdmMode()) {
      matchTimer.innerHTML = `Time Left ${tdmTimeText}<span class="timer-divider">|</span><span class="team-red">RED ${teamScores.red}</span><span class="team-divider">-</span><span class="team-blue">${teamScores.blue} BLUE</span>`;
      matchTimer.classList.add("show");
    } else {
      matchTimer.textContent = "";
      matchTimer.classList.remove("show");
    }
  }

  if (reloadIndicator) {
    if (localPlayer.ammo === 0 && !localPlayer.reloading) {
      reloadIndicator.classList.add("show");
    } else {
      reloadIndicator.classList.remove("show");
    }
  }

  if (crosshair) {
    if (!touchState.enabled) {
      crosshair.classList.add("show");
      crosshair.style.left = `${input.mouse.x}px`;
      crosshair.style.top = `${input.mouse.y}px`;
    } else {
      crosshair.classList.remove("show");
    }
  }

  if (damageVignette) {
    const intensity = clamp(damagePulse, 0, 1);
    damageVignette.style.opacity = intensity ? intensity.toFixed(3) : "0";
  }

  if (rushIndicator) {
    if (localPlayer.rushActive) {
      rushIndicator.textContent = `Echo Rush +65% ${localPlayer.surgeTime.toFixed(1)}s`;
      rushIndicator.classList.add("show");
    } else {
      rushIndicator.classList.remove("show");
    }
  }

  if (beamIndicator) {
    if (localPlayer.laserTime > 0) {
      beamIndicator.textContent = `Laser Beam ${localPlayer.laserTime.toFixed(1)}s`;
      beamIndicator.classList.add("show");
    } else {
      beamIndicator.classList.remove("show");
    }
  }

  if (streamIndicator) {
    const inStream = localPlayer.inStream;
    if (localPlayer.streamBoostTime > 0) {
      streamIndicator.textContent = `Zone Energy Boost 2x ${localPlayer.streamBoostTime.toFixed(1)}s`;
      streamIndicator.classList.add("show");
      streamIndicator.classList.remove("cooldown");
    } else if (inStream && localPlayer.streamCooldown > 0) {
      streamIndicator.textContent = `Zone Energy CD ${localPlayer.streamCooldown.toFixed(1)}s`;
      streamIndicator.classList.add("show");
      streamIndicator.classList.add("cooldown");
    } else {
      streamIndicator.classList.remove("show");
      streamIndicator.classList.remove("cooldown");
    }
  }

  if (zoneIndicator) {
    const zone = zoneAt(localPlayer.x, localPlayer.y);
    if (zone && zone.type !== "stream") {
      const label =
        zone.type === "core"
          ? "Core Zone"
          : zone.type === "bramble"
            ? "Bramble Zone"
            : zone.type === "glimmer"
              ? "Glimmer Zone"
              : "Zone";
      zoneIndicator.textContent = label;
      zoneIndicator.classList.add("show");
    } else {
      zoneIndicator.classList.remove("show");
    }
  }

  const sorted = [...players].sort((a, b) => b.score - a.score).slice(0, 5);
  uiLbList.innerHTML = sorted
    .map(
      (p) =>
        `<li><span class="lb-name">${
          isTdmMode() && p.team ? `<span class="team-dot team-${p.team}"></span>` : ""
        }${p.name}</span><span class="lb-score">${p.score}</span><span class="lb-kills">Kills ${p.kills}</span></li>`
    )
    .join("");
}

function render() {
  const cam = camera();
  const time = performance.now() / 1000;
  renderBackground(cam);
  renderPowerups(cam, time);
  renderRelays(cam, time);
  renderTrails(cam);
  renderWave(cam);
  renderLaserBeam(cam, time);
  renderBullets(cam);
  renderHitBursts(cam);
  renderDeathBursts(cam);
  renderPlayers(cam);
  renderCombat(cam);
  renderMinimap();
  renderUI();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

showMenu(getModeStatusText(), "start", "");
requestAnimationFrame(loop);

