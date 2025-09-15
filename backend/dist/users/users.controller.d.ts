import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").UserDocument>;
    findAll(): Promise<import("./schemas/user.schema").UserDocument[]>;
    findOne(id: string): Promise<import("./schemas/user.schema").UserDocument | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").UserDocument | null>;
    remove(id: string): Promise<{
        deletedCount?: number;
    }>;
}
