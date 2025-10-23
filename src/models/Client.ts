import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface ClientAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ClientCreationAttributes = Optional<ClientAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'>;

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'clients',
  }
);

