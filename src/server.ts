import app from './app.js';
import { env } from './config/env.js';
import { sequelize, testConnection } from './config/database.js';

async function start() {
  try {
    await testConnection();
    await sequelize.sync();
    app.listen(env.port, () => {
      console.log(`API escuchando en puerto ${env.port}`);
    });
  } catch (e) {
    console.error('Error iniciando aplicación:', e);
    process.exit(1);
  }
}

start();

