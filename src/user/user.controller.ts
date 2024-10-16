import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/input/dto/create-user.dto';
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
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }

    const existingUser = await this.userService.getOneByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(['Username or email already exists']);
    }
    user.username = createUserDto.username;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.firsName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.userService.saveUser(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
