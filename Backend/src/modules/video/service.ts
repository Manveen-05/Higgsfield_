import { CreateVideoType } from './model.js';

export class VideoService {
  async createVideo(data: CreateVideoType) {
    console.log('Creating video:', data.title);
    return {
      id: 'mock-video-id',
      title: data.title,
      videoUrl: data.videoUrl,
      avatarId: data.avatarId,
      createdAt: new Date().toISOString()
    };
  }

  async getVideoById(videoId: string) {
    console.log('Getting video:', videoId);
    return {
      id: videoId,
      title: 'Mock Video',
      videoUrl: 'https://example.com/mock-video.mp4',
      avatarId: 'mock-avatar-id',
      createdAt: new Date().toISOString()
    };
  }

  async getAllVideos() {
    console.log('Getting all videos');
    return [
      {
        id: 'mock-video-1',
        title: 'Mock Video 1',
        videoUrl: 'https://example.com/mock-video-1.mp4',
        avatarId: 'mock-avatar-1',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-video-2',
        title: 'Mock Video 2',
        videoUrl: 'https://example.com/mock-video-2.mp4',
        avatarId: 'mock-avatar-2',
        createdAt: new Date().toISOString()
      }
    ];
  }
}
