import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {}
  @Get(':id')
  findOne(@Param('id') id: string) {}
  @Post()
  create(@Body() input: CreateEventDto) {}
  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    input
  }
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {}
}
