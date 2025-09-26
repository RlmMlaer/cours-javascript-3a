import sequelize from "../config/database"
import { DataTypes, Model } from "sequelize"

export interface UserAttributes {
    id?: number
    username: string
    password: string
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number
    public username!: string
    public password!: string
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "User",
    }
)
