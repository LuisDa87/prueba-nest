import { sequelize } from '../config/database.js';
import '../models/User.js';
import '../models/Product.js';
import '../models/Client.js';

async function sync() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Sincronización completa');
  } catch (e) {
    console.error('Error al sincronizar:', e);
  } finally {
    await sequelize.close();
  }
}

sync();

