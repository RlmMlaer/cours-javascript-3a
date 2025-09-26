import sequelize from "../config/database"
import { DataTypes, Model } from "sequelize"

export interface PermissionAttributes {
    id?: number
    role: string
}

export class Permission extends Model<PermissionAttributes> implements PermissionAttributes {
    public id!: number
    public role!: string
}

Permission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "Permission"
    }
)
