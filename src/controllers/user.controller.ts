import { Body, Controller, Delete, Path, Post, Route, Security, Tags } from "tsoa";
import { Get } from "tsoa";
import { UserDTO } from "../dto/user.dto";
import { userService } from "../services/user.service";
import { CustomError } from "../middlewares/errorHandler";

@Route('users')
@Tags('Users')
export class UserController extends Controller {
    @Get("/")
    @Security("jwt", ["read:User"])
    public async getAllUsers(): Promise<UserDTO[]> {
        return userService.getAllUsers();
    }

    @Post("/")
    @Security("jwt", ["create:User"])
    public async createUser(
        @Body() requestBody: UserDTO
    ): Promise<UserDTO> {
        let { username, password, role } = requestBody
        if (!username || !password) {
            let error: CustomError = new Error("Username and password are required to create a user")
            error.status = 404
            throw error
        }
        if (role === undefined) role = 3
        return userService.createUser(username, password, role)
    }

    @Delete("{id}")
    @Security("jwt", ["delete:User"])
    public async deleteUser(@Path() id: number) : Promise<void> {
        let user = await userService.getUserById(id)
        if (user === null) {
            let error: CustomError = new Error("User not found")
            error.status = 404
            throw error
        }
        await userService.deleteUser(id)
    }
}
