import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { Book } from "./book.model";

export interface BookCopyAttributes {
    id?: number;
    bookId: number;
    available: boolean;
    state: number;
    book?: Book;
}

export class BookCopy
  extends Model<BookCopyAttributes>
  implements BookCopyAttributes
{
    public id!: number;
    public bookId!: number;
    public available!: boolean;
    public state!: number;
    public book?: Book;
}

BookCopy.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "book_id",
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "BookCopy",
  }
);

BookCopy.belongsTo(Book, { foreignKey: "bookId", as: "book" });
