// Migracion principal: crea esquema TechHelpDesk y elimina tablas anteriores.
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TechHelpdeskSchema20251208233000 implements MigrationInterface {
  name = 'TechHelpdeskSchema20251208233000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query('DROP TABLE IF EXISTS order_items CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS orders CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS products CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS clients CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS users CASCADE');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '120' },
          { name: 'email', type: 'varchar', length: '150', isUnique: true },
          { name: 'password', type: 'varchar', length: '200' },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'technician', 'client'],
            default: `'client'`,
          },
          { name: 'refresh_token', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '120', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'technicians',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '120' },
          { name: 'specialty', type: 'varchar', length: '150' },
          { name: 'availability', type: 'boolean', default: true },
          { name: 'user_id', type: 'uuid', isUnique: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '120' },
          { name: 'company', type: 'varchar', length: '150' },
          { name: 'contact_email', type: 'varchar', length: '150', isUnique: true },
          { name: 'user_id', type: 'uuid', isUnique: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'title', type: 'varchar', length: '180' },
          { name: 'description', type: 'text' },
          {
            name: 'status',
            type: 'enum',
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: `'open'`,
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['low', 'medium', 'high'],
            default: `'medium'`,
          },
          { name: 'categoryId', type: 'uuid' },
          { name: 'clientId', type: 'uuid' },
          { name: 'technicianId', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'technicians',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'clients',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['clientId'],
        referencedTableName: 'clients',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['technicianId'],
        referencedTableName: 'technicians',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tickets');
    await queryRunner.dropTable('clients');
    await queryRunner.dropTable('technicians');
    await queryRunner.dropTable('categories');
    await queryRunner.dropTable('users');
    await queryRunner.query('DROP TYPE IF EXISTS "users_role_enum"');
    await queryRunner.query('DROP TYPE IF EXISTS "tickets_status_enum"');
    await queryRunner.query('DROP TYPE IF EXISTS "tickets_priority_enum"');
  }
}
