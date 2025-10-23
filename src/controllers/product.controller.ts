import { Request, Response } from 'express';
import { productDao } from '../dao/product.dao.js';

export const ProductController = {
  list: async (_req: Request, res: Response) => {
    const products = await productDao.findAll();
    res.json(products);
  },

  create: async (req: Request, res: Response) => {
    const { name, price, stock } = req.body;
    if (!name || price === undefined) return res.status(400).json({ message: 'Datos incompletos' });
    const product = await productDao.create({ name, price, stock });
    res.status(201).json(product);
  },
};

