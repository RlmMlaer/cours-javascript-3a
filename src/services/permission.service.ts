import { Permission } from "../models/permission.model"

export class PermissionService {
    public async getAllPermission() {
        return Permission.findAll()
    }

    public async getRoleByPermissionId(id: number) {
        return Permission.findByPk(id)
    }
}

export const permissionService = new PermissionService()
