import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/dto/create-event.dto';
import { UpdateEventDto } from './input/dto/update-event.dto';
import { EventsService } from './event.service';
import { ListEvents } from './input/list.events';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { AuthGuardJwt } from '../auth/guards/auth-guard.jwt';
import { Event, PaginatedEvents } from './event.entity';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents): Promise<PaginatedEvents> {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );

    return events;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    const event = await this.eventsService.getEventWithAttendeeCount(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @CurrentUser() user: User,
    @Body() input: CreateEventDto,
  ): Promise<Event> {
    return this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return this.eventsService.updateEvent(id, input, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const result = await this.eventsService.deleteEvent(id, user);
    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
