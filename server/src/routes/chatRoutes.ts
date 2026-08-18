import { Router } from 'express';
import {
  getConsultationMessages,
  sendMessage,
  applyRevision,
} from '../controllers/chatController.js';

export const chatRouter = Router();

chatRouter.get('/:consultationId/messages', getConsultationMessages);
chatRouter.post('/:consultationId/messages', sendMessage);
chatRouter.post('/apply-revision', applyRevision);
