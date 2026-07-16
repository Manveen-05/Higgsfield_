import { Router } from 'express';
import { signupSchema, signinSchema } from './model.js';
import { AuthService } from './service.js';
import { prisma } from '../../db.js';

const authService = new AuthService();

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  try {
    const data = result.data;
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: data.password
      }
    });
    await authService.signup(data);
    res.json({
      id: user.id
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Username is already taken. Please choose another one.' });
      return;
    }
    res.status(500).json({ error: error.message });
  }
});

authRouter.post('/signin', async (req, res) => {
  const result = signinSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  try {
    const authResult = await authService.signin(result.data);
    res.json({ message: authResult });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.get('/me', async (req, res) => {
  try {
    const me = await authService.getMe();
    res.json(me);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
