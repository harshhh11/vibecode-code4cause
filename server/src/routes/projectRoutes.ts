import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  addFurnitureItem,
  updateFurnitureItem,
  deleteFurnitureItem,
} from '../controllers/projectController.js';

export const projectRouter = Router();

projectRouter.get('/', getAllProjects);
projectRouter.get('/:id', getProjectById);
projectRouter.post('/', createProject);
projectRouter.post('/:id/rooms/:roomId/furniture', addFurnitureItem);
projectRouter.put('/:id/rooms/:roomId/furniture/:furnitureId', updateFurnitureItem);
projectRouter.delete('/:id/rooms/:roomId/furniture/:furnitureId', deleteFurnitureItem);
