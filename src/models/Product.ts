import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface ProductAttributes {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id' | 'stock' | 'createdAt' | 'updatedAt'>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public price!: number;
  public stock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);

