import { SignupType, SigninType } from './model.js';

export class AuthService {
  async signup(data: SignupType) {
    console.log('Signing up user:', data.username);
    // Implement database/signup logic here
    return 'hi there';
  }

  async signin(data: SigninType) {
    console.log('Signing in user:', data.username);
    // Implement database/signin logic here
    return 'signed in successfully';
  }

  async getMe() {
    return {
      id: 'mock-user-id',
      username: 'mock-user',
      email: 'mock@example.com'
    };
  }
}

