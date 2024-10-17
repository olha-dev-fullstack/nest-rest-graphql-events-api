import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendence.controller';
import { AttendeeModule } from './attendee/attendee.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), AttendeeModule],
  controllers: [
    EventsController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController,
  ],
  providers: [EventsService],
})
export class EventsModule {}
