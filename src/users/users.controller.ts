import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@ApiTags('users')
@Controller('users')
export class UsersController implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private client: ClientKafka;

  async onModuleInit() {
    const requestPatters = ['find-all-user', 'find-user', 'create-user'];

    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  @Get()
  findUsers(): Observable<User[]> {
    return this.client.emit('find-all-user', {});
  }

  @Get(':id')
  finUser(@Param('id') id: number): Observable<User> {
    return this.client.send('find-user', { id });
  }

  @Post()
  @ApiBody({ type: UserDto })
  createUser(@Body() user: UserDto): Observable<User> {
    return this.client.send('create-user', user);
  }

  @Put(':id')
  @ApiBody({ type: UserDto })
  updateUser(@Param('id') id: number, @Body() user: UserDto): Observable<User> {
    const payload = {
      id,
      ...user,
    };
    return this.client.emit('update-user', payload);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.client.emit('delete-user', { id });
  }

  @Patch(':id/active')
  activeUser(@Param('id') id: number) {
    return this.client.emit('active-user', { id });
  }

  @Patch(':id/inactive')
  inactiveUser(@Param('id') id: number) {
    return this.client.emit('inactive-user', { id });
  }
}
