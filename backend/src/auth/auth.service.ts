import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
    const { email } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create new user
    const user: UserDocument = await this.usersService.create(createUserDto);

    // Generate JWT
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    // Return user and token (exclude password)
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, token };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

    async login(user: User & { _id: any }) {
    const payload = { email: user.email, sub: user._id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }
}

