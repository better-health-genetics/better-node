import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './utils/logger';
import { provisionPatientFolder } from './services/drive';
import { scheduleTelehealthConsult } from './services/calendar';
import { sendSecureDispatch } from './services/gmail';
import { sendTriageAlert } from './services/chat';

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ Middleware Fortress
app.use(helmet()); 
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://portal.bhcp.health' }));
app.use(express.json({ limit: '1mb' }));

// 🩺 Health Check
app.get('/api/health', (req: Request, res: Response) => {
  logger.info('Health check pinged', { ip: req.ip });
  res.status(200).json({ status: 'MED~USA ACTIVE. THE FORTRESS IS SECURE.' });
});

// 🚧 Google Workspace Ingress -> Master Triage Pipeline
app.post('/api/workspace/intake-triage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminEmail, targetLabEmail, patientId, chatSpaceId } = req.body;

    if (!adminEmail || !targetLabEmail || !patientId || !chatSpaceId) {
      res.status(400).json({ error: 'Missing required parameters.' });
      return;
    }

    // Sanitization: Strip garbage URL query parameters off the Chat Space ID
    const cleanChatSpaceId = chatSpaceId.split('?')[0];

    logger.info('Master Triage Pipeline initiated', { patientId, action: 'intake_triage' });
    
    // 1. Provision the Secure Drive Vault
    const folderId = await provisionPatientFolder(adminEmail, patientId);

    // 2. Generate the Telehealth Intercept (Google Meet)
    const meetLink = await scheduleTelehealthConsult(adminEmail, patientId);

    // 3. Dispatch the Secure Notification to the Lab/Physician
    const messageId = await sendSecureDispatch(adminEmail, targetLabEmail, patientId, meetLink, folderId);

    // 4. Broadcast the Internal Triage Alert to Google Chat
    const chatAlertName = await sendTriageAlert(adminEmail, cleanChatSpaceId, patientId, folderId, meetLink);

    res.status(201).json({ 
      success: true, 
      message: 'MED~USA Triage Pipeline Executed Successfully.',
      patientId,
      folderId,
      meetLink,
      dispatchMessageId: messageId,
      chatAlertName
    });
  } catch (error) {
    next(error); 
  }
});

// 💥 Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Exception', { message: err.message, path: req.path });
  res.status(500).json({ error: 'A critical system violation occurred.' });
});

app.listen(PORT, () => {
  logger.info(`🔥 MED~USA Core initialized on port ${PORT}. Awaiting commands.`);
});
