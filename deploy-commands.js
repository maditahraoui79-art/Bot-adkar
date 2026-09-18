import "dotenv/config";
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("set-islamic-channel")
    .setDescription("تحديد روم الإشعارات الإسلامية")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("الروم الذي سيرسل فيه البوت")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName("set-morning-time")
    .setDescription("تحديد وقت أذكار الصباح بصيغة HH:MM")
    .addStringOption(option =>
      option.setName("time")
        .setDescription("مثال: 07:00")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName("set-evening-time")
    .setDescription("تحديد وقت أذكار المساء بصيغة HH:MM")
    .addStringOption(option =>
      option.setName("time")
        .setDescription("مثال: 18:00")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName("set-friday-time")
    .setDescription("تحديد وقت إرسال رابط سورة الكهف يوم الجمعة")
    .addStringOption(option =>
      option.setName("time")
        .setDescription("مثال: 08:00")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName("islamic-settings")
    .setDescription("عرض إعدادات البوت الإسلامية"),

  new SlashCommandBuilder()
    .setName("islamic-test")
    .setDescription("اختبار إرسال رسالة إسلامية")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("نوع الرسالة")
        .setRequired(true)
        .addChoices(
          { name: "أذكار الصباح", value: "morning" },
          { name: "أذكار المساء", value: "evening" },
          { name: "سورة الكهف", value: "kahf" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName("islamic-disable")
    .setDescription("تعطيل الإرسال التلقائي")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
].map(command => command.toJSON());

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  throw new Error("Missing DISCORD_TOKEN or CLIENT_ID in .env");
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);

console.log("✅ تم تسجيل أوامر Bot-adkar عالميًا لجميع السيرفرات.");
