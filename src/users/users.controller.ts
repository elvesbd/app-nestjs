import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './database/user.entity';
import { UserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findUsers(): Promise<UserEntity[]> {
    return this.usersService.findUsers();
  }

  @Post()
  @ApiBody({ type: UserDto })
  async createUser(@Body() user: UserDto): Promise<UserEntity> {
    return await this.usersService.createUser(user);
  }
}
