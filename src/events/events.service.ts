import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    return this.repository.findOne({ where: { id }, relations: ['attendees'] });
  }

  async create(input: CreateEventDto): Promise<Event> {
    return this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  async update(id: string, input: UpdateEventDto): Promise<Event> {
    const eventToUpdate = await this.findOne(id);
    const newEvent = {
      ...eventToUpdate,
      ...input,
      when: input.when ? new Date(input.when) : eventToUpdate.when,
    };
    return this.repository.save(newEvent);
  }

  async remove(id: string) {
    const eventToRemove = await this.findOne(id);
    return this.repository.remove(eventToRemove);
  }
}
