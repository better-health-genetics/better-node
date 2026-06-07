import { google } from 'googleapis';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

export const getWorkspaceClient = (impersonatedEmail: string, scopes: string[]) => {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    logger.error('FATAL: GOOGLE_APPLICATION_CREDENTIALS missing.');
    throw new Error('System halted: Missing Workload Identity or Service Account credentials.');
  }

  const auth = new google.auth.GoogleAuth({
    scopes,
    clientOptions: {
      subject: impersonatedEmail,
    },
  });

  logger.info('Workspace Auth Client generated', { impersonatedEmail, scopesCount: scopes.length });
  return auth;
};
