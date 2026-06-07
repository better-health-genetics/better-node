import { google } from 'googleapis';
import { getWorkspaceClient } from './workspaceAuth';
import { logger } from '../utils/logger';

const CHAT_SCOPES = ['https://www.googleapis.com/auth/chat.messages.create'];

export const sendTriageAlert = async (
  adminEmail: string, 
  spaceId: string, 
  patientId: string, 
  folderId: string, 
  meetLink: string
) => {
  try {
    logger.info('Authorizing Chat API via Domain-Wide Delegation...', { target: 'Chat' });
    const auth = getWorkspaceClient(adminEmail, CHAT_SCOPES);
    const chat = google.chat({ version: 'v1', auth });

    logger.info('Compiling secure Markdown payload.', { patientId, spaceId });

    // 🔒 Bypassing the Card restriction using formatted rich text.
    const textPayload = `🚨 *MED~USA TRIAGE COMMAND* 🚨
*Patient ID:* ${patientId}

A new secure triage pipeline has executed. The telehealth intercept is live and the clinical vault is standing by.

🎥 *Join Telehealth Room:* ${meetLink}
📂 *Open Secure Vault:* https://drive.google.com/drive/folders/${folderId}`;

    const response = await chat.spaces.messages.create({
      parent: spaceId,
      requestBody: {
        text: textPayload
      }
    });

    if (!response.data.name) throw new Error('Chat API failed to dispatch the alert.');

    logger.info('Triage alert broadcasted successfully.', { patientId, messageName: response.data.name });
    return response.data.name;
  } catch (error) {
    logger.error('Chat dispatch catastrophic failure.', { 
      patientId, 
      error: error instanceof Error ? error.message : 'Unknown Error' 
    });
    throw error;
  }
};
