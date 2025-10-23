import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';

export function requireRole(role: 'admin' | 'vendedor') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (req.user.role !== role) return res.status(403).json({ message: 'No autorizado' });
    next();
  };
}

