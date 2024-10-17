import { Module } from '@nestjs/common';
import { AttendeeController } from './attendee.controller';
import { AttendeeService } from './attendee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [AttendeeController],
  providers: [AttendeeService],
})
export class AttendeeModule {}
