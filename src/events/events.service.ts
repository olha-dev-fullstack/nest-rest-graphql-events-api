import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from 'src/events/input/dto/create-event.dto';
import { UpdateEventDto } from 'src/events/input/dto/update-event.dto';
import { AttendeeAnswerEnum } from 'src/attendee/attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { paginate, PaginateOptions } from 'src/pagination/paginator';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  private getEventBaseQuery() {
    return this.repository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public getEventWithAttendeCountQuery() {
    return this.getEventBaseQuery().loadRelationCountAndMap(
      'e.attendeeCount',
      'e.attendees',
    );
  }

  public getEventWithAttendeeCountQuery() {
    return this.getEventBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  public async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventWithAttendeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      switch (parseInt(filter.when.toString())) {
        case WhenEventFilter.Today:
          query = query.andWhere('e.when = CURRENT_DATE');
        case WhenEventFilter.Tommorow:
          query = query.andWhere(
            "DATE_PART('day', e.when) = DATE_PART('day', NOW()) + 1",
          );
        case WhenEventFilter.ThisWeek:
          query = query.andWhere(
            "DATE_PART('week', e.when) = DATE_PART('week', NOW())",
          );
        case WhenEventFilter.NextWeek:
          query = query.andWhere(
            "DATE_PART('week', e.when) + 1 = DATE_PART('week', NOW()) + 1",
          );
      }
    }
    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginatedOptions: PaginateOptions,
  ) {
    return paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginatedOptions,
    );
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const query = this.getEventWithAttendeeCountQuery().andWhere('e.id = :id', {
      id,
    });
    // return this.repository.findOne({ where: { id }, relations: ['attendees'] });
    return query.getOne();
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
