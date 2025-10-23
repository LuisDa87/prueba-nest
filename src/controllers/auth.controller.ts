import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) return res.status(400).json({ message: 'Datos incompletos' });
      const user = await authService.register({ name, email, password, role });
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error en registro' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Datos incompletos' });
      const result = await authService.login(email, password);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error en login' });
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: 'Falta refreshToken' });
      const tokens = await authService.refresh(refreshToken);
      res.json(tokens);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error en refresh' });
    }
  },
};

