import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";
import axios from "axios";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

/**
 * Generates a video using Veo (veo-2.0-generate-001).
 * If imageUrl is provided, the image is sent as a reference for image-to-video generation.
 * Otherwise, pure text-to-video is used.
 *
 * @param prompt   Text prompt describing the video
 * @param imageUrl Optional URL of a reference image (e.g. avatar generatedImagePath)
 * @param videoId  Used to name the saved video file
 * @returns        Local path to the saved .mp4 file, or null on failure
 */
export async function generateVideo(
  prompt: string,
  videoId: string,
  imageUrl?: string
): Promise<string | null> {
  // Build reference images if an imageUrl was supplied
  let referenceImages: any[] | undefined;

  if (imageUrl) {
    try {
      // Resolve local file path (assets served from /assets/*)
      const localPath = path.join(process.cwd(), imageUrl);
      let base64Image: string;

      if (fs.existsSync(localPath)) {
        // Read from local disk (faster, no HTTP round-trip)
        base64Image = fs.readFileSync(localPath).toString("base64");
      } else {
        // Fall back to fetching from URL
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        base64Image = Buffer.from(response.data, "binary").toString("base64");
      }

      referenceImages = [
        {
          image: { imageBytes: base64Image },
          referenceType: "REFERENCE_TYPE_SUBJECT" as any,
        },
      ];

      console.log("[VIDEO GEN] Reference image loaded successfully.");
    } catch (err: any) {
      console.error("[VIDEO GEN] Failed to load reference image:", err.message);
      // Continue without reference image
    }
  }

  // Start the video generation operation
  const config: any = { durationSeconds: 5, numberOfVideos: 1 };
  if (referenceImages) config.referenceImages = referenceImages;

  console.log("[VIDEO GEN] Starting Veo generation with model veo-2.0-generate-001...");
  let operation = await ai.models.generateVideos({
    model: "veo-2.0-generate-001",
    prompt,
    config,
  });

  // Poll until done
  while (!operation.done) {
    console.log("[VIDEO GEN] Waiting for video... (polling every 10s)");
    await new Promise((r) => setTimeout(r, 10_000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const videoBytes = operation.response?.generatedVideos?.[0]?.video?.videoBytes;
  if (!videoBytes) {
    console.error("[VIDEO GEN] No video bytes in response.");
    return null;
  }

  // Save to assets folder
  const assetsDir = path.join(process.cwd(), "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  const videoFileName = `video-${videoId}.mp4`;
  const videoFilePath = path.join(assetsDir, videoFileName);
  fs.writeFileSync(videoFilePath, Buffer.from(videoBytes, "base64"));

  console.log(`[VIDEO GEN] ✅ Video saved → ${videoFilePath}`);
  console.log(`[VIDEO GEN] ✅ Access via  → http://localhost:3001/assets/${videoFileName}`);

  return `/assets/${videoFileName}`;
}
