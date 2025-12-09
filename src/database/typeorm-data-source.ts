// DataSource de TypeORM: configura conexion a PostgreSQL para CLI y runtime.
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Category } from '../categories/category.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Technician } from '../technicians/technician.entity';
import { User } from '../users/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'techhelpdesk',
  entities: [User, Client, Category, Ticket, Technician],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});

export default AppDataSource;
