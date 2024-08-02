const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_BOT_TOKEN = '7313575055:AAFm8SLWRbRx8tvha1scSQnUH3dPqSISsqw';
const TELEGRAM_GROUP_CHAT_ID = '6007714908';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

async function getRandomWikipediaArticle() {
  try {
    const randomPageResponse = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    const page = randomPageResponse.data;
    return {
      title: page.title,
      extract: page.extract,
      url: page.content_urls.desktop.page,
    };
  } catch (error) {
    console.error('Error fetching Wikipedia article:', error);
    return null;
  }
}

async function postToTelegram(article) {
  try {
    const message = `*${article.title}*\n\n${article.extract}\n\n[Read more](${article.url})`;
    await bot.sendMessage(TELEGRAM_GROUP_CHAT_ID, message, { parse_mode: 'Markdown' });
    console.log('Message posted to Telegram group.');
  } catch (error) {
    console.error('Error posting to Telegram:', error);
  }
}

async function main() {
  const article = await getRandomWikipediaArticle();
  if (article) {
    await postToTelegram(article);
  } else {
    console.error('Failed to fetch and post a Wikipedia article.');
  }
}

main();
