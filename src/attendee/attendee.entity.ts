import { Event } from 'src/events/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;
  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  @JoinColumn()
  event: Event;
}
