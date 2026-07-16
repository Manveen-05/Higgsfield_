import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './modules/auth/index.js';
import { avatarRouter } from './modules/avatar/index.js';
import { videoRouter } from './modules/video/index.js';
import { modelsRouter } from './modules/models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// Serve generated images / files from the assets folder
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

app.use('/api/v1', authRouter);
app.use('/api/v1', avatarRouter);
app.use('/api/v1', videoRouter);
app.use('/api/v1', modelsRouter);

// Serve frontend static build files
app.use(express.static(path.join(process.cwd(), '../frontend/dist')));

// Fallback all non-API GET routes to index.html for client-side routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/v1') && !req.path.startsWith('/assets')) {
    res.sendFile(path.join(process.cwd(), '../frontend/dist/index.html'));
  } else {
    next();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Single Server (Express + React) is running at http://localhost:3001`);
});
