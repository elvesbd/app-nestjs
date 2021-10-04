import { Body, Controller, OnModuleInit, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { EmailDto } from './dto/email.dto';
import { PhoneDto } from './dto/phone.dto';

@Controller('notifications')
export class NotificationController implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'notification-consumer',
      },
    },
  })
  private client: ClientKafka;

  async onModuleInit() {
    const requestPatters = [''];

    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect();
    });
  }

  @Post('email')
  sendEmail(@Body() data: EmailDto) {
    return this.client.emit('notification-email', data);
  }

  @Post('phone')
  sendPhone(@Body() data: PhoneDto) {
    return this.client.emit('notification-phone', data);
  }
}
