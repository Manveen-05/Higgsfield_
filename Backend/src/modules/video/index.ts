import { Router } from 'express';
import { createVideoSchema } from './model.js';
import { generateVideo } from './generate.js';
import { randomUUID } from 'crypto';
import 'dotenv/config';

export const videoRouter = Router();

// POST /api/v1/video/generate
// Body: { title, prompt, avatarId, imageUrl? }
videoRouter.post('/video/generate', async (req, res) => {
  const { success, data, error } = createVideoSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error: error.message });
    return;
  }

  const videoId = randomUUID();

  try {
    console.log(`[VIDEO] Starting generation for "${data.title}"...`);

    const videoPath = await generateVideo(data.prompt, videoId, data.imageUrl);

    if (!videoPath) {
      res.status(500).json({ error: 'Video generation failed — no video returned.' });
      return;
    }

    res.json({
      id: videoId,
      title: data.title,
      avatarId: data.avatarId,
      videoPath,
      videoUrl: `http://localhost:3001${videoPath}`,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[VIDEO] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/video/:videoId  — placeholder (videos are file-based, not DB-backed yet)
videoRouter.get('/video/:videoId', async (req, res) => {
  res.json({
    id: req.params.videoId,
    videoUrl: `http://localhost:3001/assets/video-${req.params.videoId}.mp4`,
  });
});
