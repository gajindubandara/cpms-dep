import axios from 'axios';

const DEBUG = process.env.NODE_ENV !== 'production';

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

  // Enhanced logging for debugging
  if (DEBUG) {
    console.log('[Telegram Config]', {
      enabled,
      botTokenPresent: !!botToken,
      chatIdPresent: !!chatId,
      messagePresent: !!message,
    });
  }

  if (!enabled) {
    if (DEBUG) console.log('[Telegram] Notifications disabled');
    return false;
  }

  if (!botToken) {
    console.error('[Telegram] Missing TELEGRAM_BOT_TOKEN environment variable');
    return false;
  }

  if (!chatId) {
    console.error('[Telegram] Missing TELEGRAM_CHAT_ID environment variable');
    return false;
  }

  if (!message) {
    console.error('[Telegram] Message is empty');
    return false;
  }

  try {
    if (DEBUG) console.log('[Telegram] Sending notification...');

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
        parse_mode: 'HTML',
      },
      {
        timeout: 10000, // 10 second timeout
      }
    );

    if (DEBUG) console.log('[Telegram] Notification sent successfully:', response.status);
    return true;
  } catch (error) {
    const errorMsg = error.response?.data?.description || error.message;
    console.error('[Telegram] Failed to send notification:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: errorMsg,
      code: error.code,
    });
    return false;
  }
};

export const buildNotificationMessage = (title, lines = []) => {
  const parts = [
    `<b>${title}</b>`,
    ...lines.filter(Boolean),
    `<i>Timestamp: ${new Date().toISOString()}</i>`,
  ];
  return parts.join('\n');
};