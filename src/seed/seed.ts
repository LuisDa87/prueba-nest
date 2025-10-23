import { sequelize } from '../config/database.js';
import '../models/User.js';
import '../models/Product.js';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { env } from '../config/env.js';

async function run() {
  try {
    console.log('Conectando a DB...');
    await sequelize.authenticate();
    await sequelize.sync();

    const adminEmail = 'admin@sportsline.com';
    const admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const password = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: adminEmail, password, role: 'admin' });
      console.log('Usuario admin creado: admin@sportsline.com / admin123');
    } else {
      console.log('Usuario admin ya existe');
    }

    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate([
        { name: 'Balón fútbol', price: 29.99, stock: 50 },
        { name: 'Tenis running', price: 79.5, stock: 20 },
        { name: 'Guantes gym', price: 12.0, stock: 100 },
      ]);
      console.log('Productos de ejemplo insertados');
    } else {
      console.log('Productos ya existen');
    }

    console.log('Seed completado');
  } catch (e) {
    console.error('Error en seed:', e);
  } finally {
    await sequelize.close();
  }
}

run();

