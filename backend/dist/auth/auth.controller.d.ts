import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createUserDto: CreateUserDto): Promise<{
        user: import("../users/schemas/user.schema").User;
        token: string;
    }>;
    login(req: any): Promise<{
        user: import("../users/schemas/user.schema").User & {
            _id: any;
        };
        token: string;
    }>;
}
