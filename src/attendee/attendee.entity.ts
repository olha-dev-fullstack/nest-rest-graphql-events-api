import { Event } from 'src/events/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AttendeeAnswerEnum {
    Accepted = 1,
    Maybe,
    Rejected
  }

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;
  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  @JoinColumn()
  event: Event;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted
  })
  answer: AttendeeAnswerEnum;

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}
