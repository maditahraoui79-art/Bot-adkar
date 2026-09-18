import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve("data");
const dataFile = path.join(dataDir, "settings.json");

const defaults = {
  channelId: null,
  morningTime: "07:00",
  eveningTime: "18:00",
  fridayTime: "08:00",
  timezone: process.env.TIMEZONE || "Africa/Algiers",
  enabled: true,
  lastSent: {
    morning: null,
    evening: null,
    friday: null
  }
};

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "{}");
}

function readAll() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return {};
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function mergeDefaults(value = {}) {
  return {
    ...defaults,
    ...value,
    lastSent: {
      ...defaults.lastSent,
      ...(value.lastSent || {})
    }
  };
}

export function getSettings(guildId) {
  const all = readAll();
  return mergeDefaults(all[guildId]);
}

export function updateSettings(guildId, patch) {
  const all = readAll();
  all[guildId] = mergeDefaults({ ...all[guildId], ...patch });
  writeAll(all);
  return all[guildId];
}
