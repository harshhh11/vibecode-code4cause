import { Router } from 'express';
import {
  getWholeHomeAllocation,
  getRoomRecommendation,
  checkFurnitureCompatibility,
  scoreLayout,
  generateLayoutPermutations,
  assistantChat,
} from '../controllers/aiController.js';

export const aiRouter = Router();

aiRouter.post('/whole-home-distribution', getWholeHomeAllocation);
aiRouter.post('/room-dimensions', getRoomRecommendation);
aiRouter.post('/furniture-check', checkFurnitureCompatibility);
aiRouter.post('/score-layout', scoreLayout);
aiRouter.post('/generate-layouts', generateLayoutPermutations);
aiRouter.post('/assistant-chat', assistantChat);
