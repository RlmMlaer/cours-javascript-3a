import { User } from "../models/user.model";

export class UserService {
    public async getAllUsers(): Promise<User[]> {
        return User.findAll()
    }

    public async getUserById(id: number) : Promise<User | null> {
        return User.findByPk(id)
    }

    public async createUser(
        username: string,
        password: string,
        role: number
    ) : Promise<User> {
        return User.create({ username, password, role})
    }

    public async deleteUser(id: number) : Promise<void> {
        const user = await User.findByPk(id)
        if (user) {
            await user.destroy()
        }
    }
}

export const userService = new UserService()
