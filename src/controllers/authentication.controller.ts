import { Body, Controller, Post, Route } from "tsoa";
import { AuthenticationDTO } from "../dto/authentication.dto";
import { CustomError } from "../middlewares/errorHandler";
import { authenticationService } from "../services/authentication.service";

@Route("auth")
export class AuthenticationController extends Controller {
    @Post("/")
    public async authenticate(@Body() requestBody: AuthenticationDTO) {
        const { grant_type, username, password  } = requestBody;
        if (grant_type !== "password") {
            const error: CustomError = new Error("Unsupported grant_type");
            error.status = 400
            throw error
        }
        const token = await authenticationService.authenticate(username, password)
        return { token }
    }
}
