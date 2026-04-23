import axios from 'axios';

const getTelegramConfig = () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const enabled = process.env.TELEGRAM_NOTIFICATIONS_ENABLED !== 'false';

  return {
    enabled,
    botToken,
    chatId,
  };
};

export const sendTelegramNotification = async (message) => {
  const { enabled, botToken, chatId } = getTelegramConfig();

  if (!enabled || !botToken || !chatId || !message) {
    return false;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    });
    return true;
  } catch (error) {
    console.warn('[Telegram] Failed to send notification:', error.message);
    return false;
  }
};

export const buildNotificationMessage = (title, lines = []) => {
  const parts = [title, ...lines.filter(Boolean)];
  return parts.join('\n');
};