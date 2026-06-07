import { google } from 'googleapis';
import { getWorkspaceClient } from './workspaceAuth';
import { logger } from '../utils/logger';

// 🛡️ SECURITY: We request ONLY the scopes we need. No full-drive access.
const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * Creates an encrypted, strictly-scoped folder for a patient in Google Drive.
 * @param adminEmail The Workspace admin email to impersonate.
 * @param patientId The secure, alphanumeric patient identifier (NO NAMES).
 */
export const provisionPatientFolder = async (adminEmail: string, patientId: string) => {
  try {
    logger.info('Authorizing Drive API via Domain-Wide Delegation...', { target: 'Drive' });
    const auth = getWorkspaceClient(adminEmail, DRIVE_SCOPES);
    const drive = google.drive({ version: 'v3', auth });

    logger.info('Initiating secure folder creation.', { patientId });

    // 🔒 The folder is isolated and scoped only to files created by this service account.
    const fileMetadata = {
      name: `MEDUSA_VAULT_${patientId}`,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    if (!folder.data.id) {
      throw new Error('Drive API failed to return a valid folder ID.');
    }

    logger.info('Secure vault provisioned successfully.', { patientId, folderId: folder.data.id });
    return folder.data.id;
  } catch (error) {
    logger.error('Drive provisioning catastrophic failure.', { 
      patientId, 
      error: error instanceof Error ? error.message : 'Unknown Error' 
    });
    throw error;
  }
};
