import { DateTime } from "luxon";
import { getSettings, updateSettings } from "./database.js";
import { morningMessage, eveningMessage, kahfMessage } from "./messages.js";

let running = false;

async function sendIfNeeded(client, guild) {
  const settings = getSettings(guild.id);
  if (!settings.enabled || !settings.channelId) return;

  const now = DateTime.now().setZone(settings.timezone || "Africa/Algiers");
  const date = now.toFormat("yyyy-LL-dd");
  const time = now.toFormat("HH:mm");

  const channel = await client.channels.fetch(settings.channelId).catch(() => null);
  if (!channel?.isTextBased()) return;

  let patch = null;

  if (time === settings.morningTime && settings.lastSent.morning !== date) {
    await channel.send(morningMessage());
    patch = { lastSent: { ...settings.lastSent, morning: date } };
  }

  if (time === settings.eveningTime && settings.lastSent.evening !== date) {
    await channel.send(eveningMessage());
    patch = { lastSent: { ...settings.lastSent, evening: date } };
  }

  if (now.weekday === 5 && time === settings.fridayTime && settings.lastSent.friday !== date) {
    await channel.send(kahfMessage());
    patch = { lastSent: { ...settings.lastSent, friday: date } };
  }

  if (patch) updateSettings(guild.id, patch);
}

export function startScheduler(client) {
  if (running) return;
  running = true;

  const check = async () => {
    for (const guild of client.guilds.cache.values()) {
      try {
        await sendIfNeeded(client, guild);
      } catch (error) {
        console.error("Scheduler error:", guild.id, error);
      }
    }
  };

  check();
  setInterval(check, 30_000);
}
