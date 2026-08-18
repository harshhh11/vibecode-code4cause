import { Router } from 'express';
import {
  getAllDesigners,
  getDesignerById,
  createConsultation,
} from '../controllers/designerController.js';

export const designerRouter = Router();

designerRouter.get('/', getAllDesigners);
designerRouter.get('/:id', getDesignerById);
designerRouter.post('/consultations', createConsultation);
