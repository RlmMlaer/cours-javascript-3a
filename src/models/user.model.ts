import sequelize from "../config/database"
import { DataTypes, Model } from "sequelize"

export interface UserAttributes {
    id?: number
    username: string
    password: string
    role: number
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number
    public username!: string
    public password!: string
    public role!: number
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
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        }
    },
    {
        sequelize,
        tableName: "User",
    }
)
