import { ClassSerializerInterceptor, Controller, Get, Param, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { AttendeeService } from './attendee.service';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}


  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('eventId') eventId: string) {
        return this.attendeeService.findByEventId(eventId)
    }
}
