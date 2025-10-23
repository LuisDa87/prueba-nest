import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type UserRole = 'admin' | 'vendedor';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role' | 'refreshToken' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public refreshToken?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
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
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'vendedor'),
      allowNull: false,
      defaultValue: 'vendedor',
    },
    refreshToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

