import { prisma } from '../../db.js';
import { CreateAvatarType } from './model.js';

export class AvatarService {
  async createAvatar(data: CreateAvatarType) {
    console.log('Creating avatar in database:', data.name);
    // Retrieve the first user or create a default user to satisfy foreign key constraints
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: 'test_user',
          password: 'test_password'
        }
      });
    }

    const avatar = await prisma.avatar.create({
      data: {
        userId: user.id,
        name: data.name,
        images: {
          create: (data.images || []).map((url) => ({
            url,
            type: 'default'
          }))
        }
      },
      include: {
        images: true
      }
    });

    return avatar;
  }

  async getAvatarById(avatarId: string) {
    console.log('Getting avatar from database:', avatarId);
    const avatar = await prisma.avatar.findUnique({
      where: { id: avatarId },
      include: {
        images: true
      }
    });
    return avatar;
  }

  async getAllAvatars() {
    console.log('Getting all avatars from database');
    const avatars = await prisma.avatar.findMany({
      include: {
        images: true
      }
    });
    return avatars;
  }
}
