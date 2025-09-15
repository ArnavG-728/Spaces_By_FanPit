import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signup(createUserDto: CreateUserDto): Promise<{
        user: User;
        token: string;
    }>;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: User & {
        _id: any;
    }): Promise<{
        user: User & {
            _id: any;
        };
        token: string;
    }>;
}
