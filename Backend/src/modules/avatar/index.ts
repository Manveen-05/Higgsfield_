import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { CreateAvatarSchenma } from './model.js';
import { AvatarService } from './service.js';
import { GoogleGenAI, Modality } from "@google/genai";

const avatarService = new AvatarService();

// Default client (v1beta) — used for text generation
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// v1alpha client — required for image generation preview models
const aiImageGen = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  httpOptions: { apiVersion: 'v1alpha' },
});

export const avatarRouter = Router();

avatarRouter.post('/avatar', async (req, res) => {
  const { success, data } = CreateAvatarSchenma.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Incorrect"
    });
    return;
  }

  try {
    const avatar = await avatarService.createAvatar(data);

    let base64Image = "";
    const imageUrl = (data.images && data.images[0]) || (data as any).image;
    if (imageUrl) {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer'
        });
        base64Image = Buffer.from(response.data, 'binary').toString('base64');
      } catch (err: any) {
        console.error("Failed to fetch image from URL:", err.message);
      }
    }

    let generatedImagePath: string | null = null;
    let generatedText: string | null = null;

    /* ---------------------------------------------------------------
     * COMMENTED OUT: IMAGE-TO-IMAGE GENERATION (Requires Paid Billing)
     * To enable, uncomment this block and comment out the text block below.
     * ---------------------------------------------------------------
    if (base64Image) {
      const imagePrompt = [
        { text: "create a picture of avatar of left side view in a studio room" },
        { inlineData: { mimeType: "image/png", data: base64Image } },
      ];

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: imagePrompt,
        });

        const assetsDir = path.join(process.cwd(), 'assets');
        fs.mkdirSync(assetsDir, { recursive: true });
        const filePath = path.join(assetsDir, 'gemini-native-image.png');

        const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (imagePart?.inlineData?.data) {
          const buffer = Buffer.from(imagePart.inlineData.data, "base64");
          fs.writeFileSync(filePath, buffer);
          console.log(`[SUCCESS] Generated image saved to ${filePath}`);
        } else {
          const buffer = Buffer.from(base64Image, "base64");
          fs.writeFileSync(filePath, buffer);
          console.log(`[Fallback] Image saved to ${filePath}`);
        }
        generatedImagePath = `/assets/gemini-native-image.png`;
      } catch (aiErr: any) {
        console.error("Gemini AI Error:", aiErr.message);
        const assetsDir = path.join(process.cwd(), 'assets');
        fs.mkdirSync(assetsDir, { recursive: true });
        const filePath = path.join(assetsDir, 'gemini-native-image.png');
        const buffer = Buffer.from(base64Image, "base64");
        fs.writeFileSync(filePath, buffer);
        generatedImagePath = `/assets/gemini-native-image.png`;
      }
    }
    --------------------------------------------------------------- */

    // -----------------------------------------------------------
    // STEP 1: TEXT GENERATION using gemini-2.5-flash
    // Generates a rich description that is then used as the image prompt.
    // -----------------------------------------------------------
    const userPrompt = data.prompt || `Create a detailed 2-sentence physical description of an avatar named "${data.name}".`;

    try {
      const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
      });

      generatedText = textResponse.text || null;

      const assetsDir = path.join(process.cwd(), 'assets');
      fs.mkdirSync(assetsDir, { recursive: true });
      const textFilePath = path.join(assetsDir, 'avatar-description.txt');
      fs.writeFileSync(textFilePath, generatedText ?? '');
      console.log(`[SUCCESS] Text description saved to ${textFilePath}`);
    } catch (aiErr: any) {
      console.error("Gemini Text Error:", aiErr.message);
    }

    // -----------------------------------------------------------
    // STEP 2: TEXT-TO-IMAGE using gemini-2.0-flash-preview-image-generation
    // Requires v1alpha API — uses dedicated aiImageGen client
    // -----------------------------------------------------------
    const imagePrompt = generatedText || userPrompt;

    try {
      console.log("[IMAGE GEN] Calling gemini-2.0-flash-preview-image-generation (v1alpha)...");
      const imgResponse = await aiImageGen.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: imagePrompt,
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      const parts = imgResponse.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

      if (imagePart?.inlineData?.data) {
        const assetsDir = path.join(process.cwd(), 'assets');
        fs.mkdirSync(assetsDir, { recursive: true });
        const imgFileName = `avatar-${avatar.id}.png`;
        const imgFilePath = path.join(assetsDir, imgFileName);
        const buffer = Buffer.from(imagePart.inlineData.data, "base64");
        fs.writeFileSync(imgFilePath, buffer);
        generatedImagePath = `/assets/${imgFileName}`;
        console.log(`[SUCCESS] Image saved → ${imgFilePath}`);
        console.log(`[SUCCESS] Access via  → http://localhost:3001/assets/${imgFileName}`);
      } else {
        console.error("[IMAGE GEN] No image returned. Parts:",
          JSON.stringify(parts.map((p: any) => ({ hasText: !!p.text, mimeType: p.inlineData?.mimeType })))
        );
      }
    } catch (aiErr: any) {
      console.error("Gemini Image Error:", aiErr.message);
    }

    res.json({
      ...avatar,
      generatedImagePath,
      generatedText,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

avatarRouter.get('/avatar/:avatarId', async (req, res) => {
  try {
    const avatar = await avatarService.getAvatarById(req.params.avatarId);
    if (!avatar) {
      res.status(404).json({ error: 'Avatar not found' });
      return;
    }
    res.json(avatar);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

avatarRouter.get('/avatars', async (req, res) => {
  try {
    const avatars = await avatarService.getAllAvatars();
    res.json(avatars);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
