import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './utils/logger';
import { provisionPatientFolder } from './services/drive';
import { sendSecureDispatch } from './services/gmail';
import { scheduleTelehealthConsult } from './services/calendar';

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ Middleware Fortress
app.use(helmet()); 
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://portal.bhcp.health' }));
app.use(express.json({ limit: '1mb' }));

// 🩺 Health Check / Ignition
app.get('/api/health', (req: Request, res: Response) => {
  logger.info('Health check pinged', { ip: req.ip });
  res.status(200).json({ status: 'MED~USA ACTIVE. THE FORTRESS IS SECURE.' });
});

// 🚧 Google Workspace Ingress -> Master Triage Pipeline (Drive + Meet + Gmail)
app.post('/api/workspace/intake-triage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminEmail, targetLabEmail, patientId } = req.body;

    if (!adminEmail || !targetLabEmail || !patientId) {
      res.status(400).json({ error: 'Missing required parameters: adminEmail, targetLabEmail, patientId' });
      return;
    }

    logger.info('Master Triage Pipeline initiated', { patientId, action: 'intake_triage' });
    
    // 1. Provision the Secure Drive Vault
    const folderId = await provisionPatientFolder(adminEmail, patientId);

    // 2. Generate the Telehealth Intercept (Google Meet)
    const meetLink = await scheduleTelehealthConsult(adminEmail, patientId);

    // 3. Dispatch the Secure Notification to the Lab/Physician
    const messageId = await sendSecureDispatch(adminEmail, targetLabEmail, patientId, meetLink, folderId);

    res.status(201).json({ 
      success: true, 
      message: 'MED~USA Triage Pipeline Executed Successfully.',
      patientId,
      folderId,
      meetLink,
      dispatchMessageId: messageId
    });
  } catch (error) {
    next(error); 
  }
});

// 🚧 Google Workspace Ingress -> Drive Provisioning
app.post('/api/workspace/provision', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminEmail, patientId } = req.body;

    if (!adminEmail || !patientId) {
      res.status(400).json({ error: 'Missing required parameters: adminEmail, patientId' });
      return;
    }

    logger.info('Workspace provisioning initiated', { patientId, action: 'provision_drive' });
    
    // Execute the Drive creation via Domain-Wide Delegation
    const folderId = await provisionPatientFolder(adminEmail, patientId);

    res.status(201).json({ 
      success: true, 
      message: 'MED~USA Vault provisioned.',
      folderId 
    });
  } catch (error) {
    next(error); // Pass to our global error handler
  }
});

// 🚧 Google Workspace Ingress -> Telehealth Generation (Calendar/Meet)
app.post('/api/workspace/telehealth', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminEmail, patientId } = req.body;

    if (!adminEmail || !patientId) {
      res.status(400).json({ error: 'Missing required parameters: adminEmail, patientId' });
      return;
    }

    logger.info('Telehealth intercept requested', { patientId, action: 'generate_meet' });
    
    // Execute the Calendar/Meet creation via Domain-Wide Delegation
    const meetLink = await scheduleTelehealthConsult(adminEmail, patientId);

    res.status(201).json({ 
      success: true, 
      message: 'MED~USA Telehealth Link Generated.',
      meetLink 
    });
  } catch (error) {
    next(error); 
  }
});

// 💥 Global Error Handler (Prevents stack trace leakage)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Exception', { message: err.message, path: req.path });
  res.status(500).json({ error: 'A critical system violation occurred.' });
});

app.listen(PORT, () => {
  logger.info(`🔥 MED~USA Core initialized on port ${PORT}. Awaiting commands.`);
});
