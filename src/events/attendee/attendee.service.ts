import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { CreateAttendeeDto } from '../input/dto/create-attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: string): Promise<Attendee[]> {
    return this.attendeeRepository.find({
      where: { event: { id: eventId } },
    });
  }

  public async findOneByEventIdAndUserId(
    eventId: string,
    userId: string,
  ): Promise<Attendee | undefined> {
    return this.attendeeRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: string,
    userId: string,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();

    attendee.eventId = eventId;
    attendee.userId = userId;
    attendee.answer = input.answer;

    return this.attendeeRepository.save(attendee);
  }
}
