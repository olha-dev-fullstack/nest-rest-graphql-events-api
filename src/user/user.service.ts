import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async getOneByUsernameOrEmail(username: string, email: string) {
    return this.userRepository.findOne({ where: [{ username }, { email }] });
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(
      new User({
        ...createUserDto,
        password: await this.authService.hashPassword(createUserDto.password),
      }),
    );
  }
}
