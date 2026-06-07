import { google } from 'googleapis';
import { getWorkspaceClient } from './workspaceAuth';
import { logger } from '../utils/logger';

// 🛡️ SECURITY: We only need permission to SEND emails, not read the inbox.
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

/**
 * Dispatches a secure email notification to the clinic or lab.
 * @param adminEmail The Workspace admin email to impersonate (sender).
 * @param targetEmail The recipient email (e.g., the compounding lab).
 * @param patientId The secure, alphanumeric patient identifier.
 * @param meetLink The synchronous telehealth link.
 * @param folderId The encrypted Drive vault ID.
 */
export const sendSecureDispatch = async (
  adminEmail: string, 
  targetEmail: string, 
  patientId: string, 
  meetLink: string, 
  folderId: string
) => {
  try {
    logger.info('Authorizing Gmail API via Domain-Wide Delegation...', { target: 'Gmail' });
    const auth = getWorkspaceClient(adminEmail, GMAIL_SCOPES);
    const gmail = google.gmail({ version: 'v1', auth });

    logger.info('Compiling secure dispatch payload.', { patientId, targetEmail });

    // 🔒 Build a raw, RFC 2822 formatted email. No PHI in the body, only references.
    const subject = `[MED~USA SECURE] Action Required: Triage Dispatch for ${patientId}`;
    const body = `
MED~USA SECURE DISPATCH
=========================================
PATIENT ID: ${patientId}
STATUS: AWAITING PHYSICIAN SYNC

A secure telehealth intercept has been generated.
Telehealth Room: ${meetLink}

Clinical documents are secured in the MED~USA Vault.
Vault ID: ${folderId}

DO NOT REPLY WITH PHI.
=========================================
`.trim();

    const rawMessage = [
      `To: ${targetEmail}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\n');

    // Base64url encode the message as required by the Gmail API
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me', // 'me' refers to the impersonated adminEmail
      requestBody: {
        raw: encodedMessage,
      },
    });

    if (!response.data.id) throw new Error('Gmail API failed to dispatch the message.');

    logger.info('Secure dispatch transmitted successfully.', { patientId, messageId: response.data.id });
    return response.data.id;
  } catch (error) {
    logger.error('Gmail dispatch catastrophic failure.', { 
      patientId, 
      error: error instanceof Error ? error.message : 'Unknown Error' 
    });
    throw error;
  }
};
