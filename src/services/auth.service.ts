import bcrypt from 'bcryptjs';
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { userDao } from '../dao/user.dao.js';
import { env } from '../config/env.js';
import { RegisterDTO } from '../dtos/auth.dto.js';
import { User } from '../models/User.js';
import { encryptHybrid } from '../utils/encryption.js';

function signAccessToken(payload: object) {
  const opts: SignOptions = { expiresIn: env.jwt.expiresIn as any };
  return jwt.sign(payload as any, env.jwt.secret as Secret, opts);
}

function signRefreshToken(payload: object) {
  const opts: SignOptions = { expiresIn: env.jwt.refreshExpiresIn as any };
  return jwt.sign(payload as any, env.jwt.refreshSecret as Secret, opts);
}

export const authService = {
  async register(data: RegisterDTO) {
    const exists = await userDao.findByEmail(data.email);
    if (exists) throw new Error('Email ya registrado');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await userDao.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role || 'vendedor',
    } as Partial<User>);

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async login(email: string, password: string) {
    const user = await userDao.findByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Credenciales inválidas');

    const basePayload = { sub: user.id, role: user.role };
    const accessToken = signAccessToken(basePayload);
    const refreshToken = signRefreshToken(basePayload);

    await userDao.setRefreshToken(user.id, refreshToken);

    let secure: any = null;
    if (env.rsa.publicKey) {
      try {
        secure = encryptHybrid(`Bienvenido ${user.name}`, env.rsa.publicKey);
      } catch {
        secure = null;
      }
    }

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
      secure,
    };
  },

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.jwt.refreshSecret) as any;
      const user = await userDao.findById(decoded.sub);
      if (!user || user.refreshToken !== token) throw new Error('Refresh inválido');

      const basePayload = { sub: user.id, role: user.role };
      const accessToken = signAccessToken(basePayload);
      const newRefreshToken = signRefreshToken(basePayload);
      await userDao.setRefreshToken(user.id, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new Error('Refresh inválido');
    }
  },
};
