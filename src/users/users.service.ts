import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './database/user.entity';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async createUser(user: User): Promise<UserEntity> {
    const newUser = await this.usersRepository.save(user);
    return newUser;
  }
}
