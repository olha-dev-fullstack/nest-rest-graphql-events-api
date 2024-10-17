import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AttendeeService } from './attendee/attendee.service';
import { CreateAttendeeDto } from './input/dto/create-attendee.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';

@Controller('events-attendance')
@UseGuards(AuthGuardJwt)
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventService: EventsService,
    private readonly attendeeService: AttendeeService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: User, @Query('page') page = 1) {
    return this.eventService.getEventsAttendedByUserIdPaginated(user.id, {
      limit: 6,
      currentPage: page,
    });
  }

  @Get('/:eventId')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeeService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );
    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put('/:eventId')
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return this.attendeeService.createOrUpdate(input, eventId, user.id);
  }
}
