import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: { sub: string; role: 'admin' | 'vendedor' };
}

export function verifyJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Sin token' });
  const [type, token] = auth.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Token inválido' });
  try {
    const decoded = jwt.verify(token, env.jwt.secret) as any;
    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

