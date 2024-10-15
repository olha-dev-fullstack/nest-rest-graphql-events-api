import {
  Body,
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
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventsService } from './events.service';
import { NotFoundError } from 'rxjs';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}
  @Get()
  async findAll() {
    this.logger.log(`findAll route`);
    const events = await this.eventsService.findAll();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return this.eventsService.create(input);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateEventDto,
  ) {
    return this.eventsService.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    return this.eventsService.remove(id);
  }
}
