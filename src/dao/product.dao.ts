import { Product } from '../models/Product.js';

export const productDao = {
  create(data: Partial<Product>) {
    return Product.create(data as any);
  },
  findAll() {
    return Product.findAll();
  },
};

