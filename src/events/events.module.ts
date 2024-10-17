import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController, EventsOrganizedByUserController],
  providers: [EventsService],
})
export class EventsModule {}
