import { Router } from 'express';
import { ModelsService } from './service.js';

const modelsService = new ModelsService();

export const modelsRouter = Router();

modelsRouter.get('/models', async (req, res) => {
  try {
    const models = await modelsService.getModels();
    res.json(models);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
