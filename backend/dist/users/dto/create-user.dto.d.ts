import { UserRole } from '../schemas/user.schema';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}
