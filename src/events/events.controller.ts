import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventsService } from './events.service';

@Controller('/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  async create(
    @Body() input: CreateEventDto,
  ) {
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
    return this.eventsService.remove(id);
  }
}
