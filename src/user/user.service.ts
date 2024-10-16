import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOneByUsernameOrEmail(username: string, email: string) {
    return this.userRepository.findOne({ where: [{ username }, { email }] });
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }
}
