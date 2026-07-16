export class ModelsService {
  async getModels() {
    console.log('Getting all models');
    return [
      {
        id: 'mock-model-1',
        name: 'Realistic Portrait v1',
        description: 'Excellent model for portraits and avatars.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-model-2',
        name: 'Anime Style v2',
        description: 'Excellent model for anime and cartoon illustration.',
        createdAt: new Date().toISOString()
      }
    ];
  }
}
