import axios from 'axios';
import { getClientById } from '../daos/clientDao.js';
import { getProjectById } from '../daos/projectDao.js';
import { getPaymentById } from '../daos/paymentDao.js';
import { getExpenseById } from '../daos/expenseDao.js';
import { getDocumentById } from '../daos/documentDao.js';

const DEBUG = process.env.NODE_ENV !== 'production';
const PROD = process.env.NODE_ENV === 'production';

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

const getAttrs = (obj) => obj?.Attributes ?? obj;

/**
 * Fetch meaningful details for notification enrichment
 */
const getClientName = async (clientId) => {
  try {
    if (!clientId) return null;
    const client = await getClientById(clientId);
    return getAttrs(client)?.clientName || 'Unknown';
  } catch (error) {
    console.warn('[Telegram] Error fetching client name:', error.message);
    return 'Unknown';
  }
};

const getProjectName = async (projectId) => {
  try {
    if (!projectId) return null;
    const project = await getProjectById(projectId);
    const attrs = getAttrs(project);
    if (Array.isArray(project) && project.length > 0) {
      return getAttrs(project[0])?.projectName || 'Unknown';
    }
    return attrs?.projectName || 'Unknown';
  } catch (error) {
    console.warn('[Telegram] Error fetching project name:', error.message);
    return 'Unknown';
  }
};

export const sendTelegramNotification = async (message) => {
  const { enabled, botToken, chatId } = getTelegramConfig();

  // Enhanced logging for debugging (dev and prod)
  if (DEBUG) {
    console.log('[Telegram Config]', {
      enabled,
      botTokenPresent: !!botToken,
      chatIdPresent: !!chatId,
      messagePresent: !!message,
    });
  }

  // Log config in production too for debugging issues
  if (PROD && (!botToken || !chatId)) {
    console.error('[Telegram] Production config issue:', {
      botTokenPresent: !!botToken,
      chatIdPresent: !!chatId,
      enabledValue: process.env.TELEGRAM_NOTIFICATIONS_ENABLED,
      allEnv: Object.keys(process.env).filter(k => k.includes('TELEGRAM')),
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
    if (DEBUG || PROD) console.log('[Telegram] Sending notification...');

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

    // Log success in both dev and prod
    console.log(`[Telegram] Notification sent successfully: ${response.status}`);
    return true;
  } catch (error) {
    const errorMsg = error.response?.data?.description || error.message;
    // Always log errors
    console.error('[Telegram] Failed to send notification:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: errorMsg,
      code: error.code,
      botTokenLen: botToken?.length || 0,
      chatIdValue: chatId || 'EMPTY',
    });
    return false;
  }
};

/**
 * Build a generic notification message (legacy support)
 */
export const buildNotificationMessage = (title, lines = []) => {
  const parts = [
    `<b>${title}</b>`,
    ...lines.filter(Boolean),
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.join('\n');
};

/**
 * Build Client notification with meaningful details
 */
export const buildClientNotificationMessage = (action, clientData) => {
  const attrs = getAttrs(clientData);
  const parts = [
    `<b>${action} - Client</b>`,
    `📋 <b>Name:</b> ${attrs?.clientName || 'N/A'}`,
    `📧 <b>Email:</b> ${attrs?.email || 'N/A'}`,
    `📍 <b>Type:</b> ${attrs?.clientType?.toUpperCase() || 'N/A'}`,
    attrs?.phone ? `📞 <b>Phone:</b> ${attrs.phone}` : null,
    attrs?.status ? `🔹 <b>Status:</b> ${attrs.status.toUpperCase()}` : null,
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.filter(Boolean).join('\n');
};

/**
 * Build Project notification with meaningful details
 */
export const buildProjectNotificationMessage = async (action, projectData, clientId) => {
  const attrs = getAttrs(projectData);
  const clientName = clientId ? await getClientName(clientId) : 'N/A';

  const parts = [
    `<b>${action} - Project</b>`,
    `🏢 <b>Client:</b> ${clientName}`,
    `🚀 <b>Project:</b> ${attrs?.projectName || 'N/A'}`,
    attrs?.status ? `🔹 <b>Status:</b> ${attrs.status.toUpperCase()}` : null,
    attrs?.startDate ? `📅 <b>Start:</b> ${attrs.startDate}` : null,
    attrs?.endDate ? `📅 <b>End:</b> ${attrs.endDate}` : null,
    attrs?.cost ? `💰 <b>Cost:</b> ${attrs.currency || ''} ${Number(attrs.cost || 0).toFixed(2)}`.trim() : null,
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.filter(Boolean).join('\n');
};

/**
 * Build Document (Invoice/Quotation) notification with meaningful details
 */
export const buildDocumentNotificationMessage = async (action, documentType, documentData) => {
  const attrs = getAttrs(documentData);
  const clientName = attrs?.clientId ? await getClientName(attrs?.clientId) : 'N/A';
  const docTypeName = documentType?.toUpperCase() || 'DOCUMENT';

  const parts = [
    `<b>${action} - ${docTypeName}</b>`,
    `📄 <b>Number:</b> ${attrs?.meta?.document_number || 'N/A'}`,
    `🏢 <b>Client:</b> ${clientName}`,
    attrs?.meta?.issue_date ? `📅 <b>Date:</b> ${attrs.meta.issue_date}` : null,
    attrs?.meta?.due_date ? `⏰ <b>Due:</b> ${attrs.meta.due_date}` : null,
    attrs?.meta?.amount ? `💰 <b>Amount:</b> ${attrs.meta.currency || ''} ${Number(attrs.meta.amount || 0).toFixed(2)}`.trim() : null,
    attrs?.meta?.status ? `🔹 <b>Status:</b> ${attrs.meta.status.toUpperCase()}` : null,
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.filter(Boolean).join('\n');
};

/**
 * Build Payment notification with meaningful details
 */
export const buildPaymentNotificationMessage = async (action, paymentData) => {
  const attrs = getAttrs(paymentData);
  const clientName = attrs?.clientId ? await getClientName(attrs?.clientId) : 'N/A';
  const projectName = attrs?.projectId ? await getProjectName(attrs?.projectId) : 'N/A';

  const parts = [
    `<b>${action} - Payment</b>`,
    `💳 <b>Payment ID:</b> ${attrs?.paymentId || 'N/A'}`,
    `🏢 <b>Client:</b> ${clientName}`,
    `🚀 <b>Project:</b> ${projectName}`,
    `💰 <b>Amount:</b> ${attrs?.currency || ''} ${Number(attrs?.amount || 0).toFixed(2)}`.trim(),
    `📅 <b>Due:</b> ${attrs?.dueDate || 'N/A'}`,
    `🔹 <b>Status:</b> ${(attrs?.status || 'PENDING').toUpperCase()}`,
    attrs?.description ? `📝 <b>Description:</b> ${attrs.description}` : null,
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.filter(Boolean).join('\n');
};

/**
 * Build Expense notification with meaningful details
 */
export const buildExpenseNotificationMessage = async (action, expenseData) => {
  const attrs = getAttrs(expenseData);
  const projectName = attrs?.projectId ? await getProjectName(attrs?.projectId) : 'N/A';

  const parts = [
    `<b>${action} - Expense</b>`,
    `🧾 <b>Expense ID:</b> ${attrs?.expenseId || 'N/A'}`,
    `🚀 <b>Project:</b> ${projectName}`,
    `💰 <b>Amount:</b> ${attrs?.currency || ''} ${Number(attrs?.amount || 0).toFixed(2)}`.trim(),
    `🔹 <b>Category:</b> ${attrs?.category || 'N/A'}`,
    attrs?.description ? `📝 <b>Description:</b> ${attrs.description}` : null,
    attrs?.expenseStatus || attrs?.status ? `🔹 <b>Status:</b> ${(attrs?.expenseStatus || attrs?.status || 'PENDING').toUpperCase()}` : null,
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.filter(Boolean).join('\n');
};

/**
 * Build Ticket notification with meaningful details
 */
export const buildTicketNotificationMessage = async (action, ticketData) => {
  const attrs = getAttrs(ticketData);
  const clientName = attrs?.clientId ? await getClientName(attrs?.clientId) : 'N/A';
  const projectName = attrs?.projectId ? await getProjectName(attrs?.projectId) : 'N/A';
  
  const parts = [
    `<b>${action} - Ticket</b>`,
    `🎫 <b>Ticket ID:</b> ${attrs?.ticketId || 'N/A'}`,
    `🏢 <b>Client:</b> ${clientName}`,
    attrs?.projectId ? `🚀 <b>Project:</b> ${projectName}` : null,
    `📌 <b>Subject:</b> ${attrs?.subject || 'N/A'}`,
    `🔹 <b>Status:</b> ${(attrs?.status || 'Open').toUpperCase()}`,
    attrs?.priority ? `⚠️ <b>Priority:</b> ${attrs.priority.toUpperCase()}` : null,
    `<i>Date: ${new Date().toISOString()}</i>`,
  ];
  return parts.filter(Boolean).join('\n');
};
