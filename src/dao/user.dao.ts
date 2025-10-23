import { User } from '../models/User.js';

export const userDao = {
  async create(data: Partial<User>) {
    return User.create(data as any);
  },

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  },

  async findById(id: string) {
    return User.findByPk(id);
  },

  async setRefreshToken(userId: string, token: string | null) {
    await User.update({ refreshToken: token }, { where: { id: userId } });
  },
};

