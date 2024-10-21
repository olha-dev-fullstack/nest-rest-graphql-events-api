import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.getOneByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(['Username or email already exists']);
    }
    const user = await this.userService.create(createUserDto);
    return {
      ...user,
      token: this.authService.getTokenForUser(user),
    };
  }
}
