import { EmbedBuilder } from "discord.js";
import { MORNING_ADHKAR, EVENING_ADHKAR, ADHKAR_SOURCE } from "./adhkar.js";

const KAHF_URL = "https://quran.com/ar/al-kahf";

function adhkarEmbed(title, items) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription("اللهم اجعلها تذكيرًا نافعًا وذكرًا مباركًا.")
    .setFooter({ text: "المصدر: حصن المسلم" })
    .setTimestamp();

  for (const item of items) {
    embed.addFields({
      name: item.title,
      value: item.text + "\n\n**العدد:** " + item.count
    });
  }

  return embed;
}

export function morningMessage() {
  return {
    embeds: [adhkarEmbed("☀️ أذكار الصباح", MORNING_ADHKAR)],
    content: "صباحكم ذكر وطاعة.\n" + ADHKAR_SOURCE
  };
}

export function eveningMessage() {
  return {
    embeds: [adhkarEmbed("🌙 أذكار المساء", EVENING_ADHKAR)],
    content: "مساؤكم ذكر وطاعة.\n" + ADHKAR_SOURCE
  };
}

export function kahfMessage() {
  return {
    embeds: [
      new EmbedBuilder()
        .setTitle("📖 سورة الكهف")
        .setDescription("حان وقت تذكير يوم الجمعة بقراءة سورة الكهف.")
        .addFields({
          name: "الرابط",
          value: KAHF_URL
        })
        .setFooter({ text: "سورة الكهف — السورة رقم 18" })
        .setTimestamp()
    ]
  };
}
