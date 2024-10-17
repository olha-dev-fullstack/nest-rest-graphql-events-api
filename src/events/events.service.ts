import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Event, PaginatedEvents } from './event.entity';
import { CreateEventDto } from 'src/events/input/dto/create-event.dto';
import { UpdateEventDto } from 'src/events/input/dto/update-event.dto';
import { AttendeeAnswerEnum } from 'src/events/attendee/attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { User } from 'src/user/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  async findAll() {
    return this.repository.find();
  }

  async getEvent(id: string) {
    const query = this.getEventWithAttendeeCountQuery().andWhere('e.id = :id', {
      id,
    });
    // return this.repository.getEvent({ where: { id }, relations: ['attendees'] });
    return query.getOne();
  }

  async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return this.repository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }

  async updateEvent(
    id: string,
    input: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const eventToUpdate = await this.getEvent(id);

    if (!eventToUpdate) {
      throw new NotFoundException(`Event not with id ${id} found`);
    }

    if (eventToUpdate.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'User is not authorized to update this event',
      );
    }
    const newEvent = {
      ...eventToUpdate,
      ...input,
      when: input.when ? new Date(input.when) : eventToUpdate.when,
    };
    return this.repository.save(newEvent);
  }

  async deleteEvent(id: string, user: User): Promise<DeleteResult> {
    const eventToDelete = await this.getEvent(id);

    if (!eventToDelete) {
      throw new NotFoundException(`Event not with id ${id} found`);
    }

    if (eventToDelete.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'User is not authorized to delete this event',
      );
    }

    return await this.repository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

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
  ): Promise<PaginatedEvents> {
    return paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginatedOptions,
    );
  }

  private getEventsOrganizedByUserIdQuery(userId: number) {
    return this.getEventBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }

  public async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions,
    );
  }

  private getEventsAttendedByUserIdQuery(userId: string) {
    const query = this.getEventBaseQuery()
    .leftJoinAndSelect('e.attendees', 'a')
    .where('a.userId = :userId', { userId });
    console.log(query);
    
    return this.getEventBaseQuery()
      .leftJoinAndSelect('e.attendees', 'a')
      .where('a.userId = :userId', { userId });
  }

  public async getEventsAttendedByUserIdPaginated(
    userId: string,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions,
    );
  }
}
