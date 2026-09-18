import "dotenv/config";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionFlagsBits
} from "discord.js";
import { DateTime } from "luxon";
import { getSettings, updateSettings } from "./database.js";
import { startScheduler } from "./scheduler.js";
import { morningMessage, eveningMessage, kahfMessage } from "./messages.js";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Missing DISCORD_TOKEN in .env");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, ready => {
  console.log(`✅ ${ready.user.tag} is online.`);
  startScheduler(client);
});

function isAdmin(interaction) {
  return interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
}

function validTime(value) {
  return /^([01]\\d|2[0-3]):[0-5]\\d$/.test(value);
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() || !interaction.guild) return;

  try {
    const name = interaction.commandName;
    const settings = getSettings(interaction.guild.id);

    if (["set-islamic-channel", "set-morning-time", "set-evening-time", "set-friday-time", "islamic-test", "islamic-disable"].includes(name) && !isAdmin(interaction)) {
      return interaction.reply({ content: "❌ تحتاج إلى صلاحية إدارة السيرفر.", ephemeral: true });
    }

    if (name === "set-islamic-channel") {
      const channel = interaction.options.getChannel("channel", true);
      updateSettings(interaction.guild.id, { channelId: channel.id, enabled: true });
      return interaction.reply(`✅ تم تحديد ${channel} كروم للإشعارات الإسلامية.`);
    }

    if (name === "set-morning-time") {
      const time = interaction.options.getString("time", true);
      if (!validTime(time)) return interaction.reply({ content: "❌ الوقت يجب أن يكون بصيغة HH:MM مثل 07:00.", ephemeral: true });
      updateSettings(interaction.guild.id, { morningTime: time, enabled: true });
      return interaction.reply(`✅ تم تحديد أذكار الصباح يوميًا الساعة **${time}**.`);
    }

    if (name === "set-evening-time") {
      const time = interaction.options.getString("time", true);
      if (!validTime(time)) return interaction.reply({ content: "❌ الوقت يجب أن يكون بصيغة HH:MM مثل 18:00.", ephemeral: true });
      updateSettings(interaction.guild.id, { eveningTime: time, enabled: true });
      return interaction.reply(`✅ تم تحديد أذكار المساء يوميًا الساعة **${time}**.`);
    }

    if (name === "set-friday-time") {
      const time = interaction.options.getString("time", true);
      if (!validTime(time)) return interaction.reply({ content: "❌ الوقت يجب أن يكون بصيغة HH:MM مثل 08:00.", ephemeral: true });
      updateSettings(interaction.guild.id, { fridayTime: time, enabled: true });
      return interaction.reply(`✅ تم تحديد إرسال سورة الكهف يوم الجمعة الساعة **${time}**.`);
    }

    if (name === "islamic-settings") {
      const channelText = settings.channelId ? `<#${settings.channelId}>` : "غير محدد";
      const embed = new EmbedBuilder()
        .setTitle("⚙️ إعدادات Bot-adkar")
        .addFields(
          { name: "الروم", value: channelText, inline: true },
          { name: "أذكار الصباح", value: settings.morningTime, inline: true },
          { name: "أذكار المساء", value: settings.eveningTime, inline: true },
          { name: "سورة الكهف", value: `الجمعة — ${settings.fridayTime}`, inline: true },
          { name: "المنطقة الزمنية", value: settings.timezone, inline: true },
          { name: "الحالة", value: settings.enabled ? "🟢 مفعّل" : "🔴 متوقف", inline: true }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (name === "islamic-test") {
      const type = interaction.options.getString("type", true);
      if (type === "morning") await interaction.channel.send(morningMessage());
      if (type === "evening") await interaction.channel.send(eveningMessage());
      if (type === "kahf") await interaction.channel.send(kahfMessage());
      return interaction.reply({ content: "✅ تم إرسال الاختبار.", ephemeral: true });
    }

    if (name === "islamic-disable") {
      updateSettings(interaction.guild.id, { enabled: false });
      return interaction.reply("⏸️ تم تعطيل الإرسال التلقائي.");
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ حدث خطأ أثناء تنفيذ الأمر.", ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
