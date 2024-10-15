import { Attendee } from 'src/attendee/attendee.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;
  @OneToMany(() => Attendee, (attendee) => attendee.event)
  attendees: Attendee[];
}
