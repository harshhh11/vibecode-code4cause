import { Router } from 'express';
import {
  getFurnitureCatalog,
  getColorThemes,
  exportSpecSheet,
} from '../controllers/catalogController.js';

export const catalogRouter = Router();

catalogRouter.get('/furniture', getFurnitureCatalog);
catalogRouter.get('/themes', getColorThemes);
catalogRouter.post('/export/spec-sheet', exportSpecSheet);
