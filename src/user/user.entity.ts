import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../auth/profile.entity';
import { Event } from './../events/event.entity';
import { Expose } from 'class-transformer';
import { Attendee } from './../events/attendee/attendee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;
  @Column({ unique: true })
  @Expose()
  username: string;
  @Column()
  password: string;
  @Column({ unique: true })
  @Expose()
  email: string;
  @Column()
  @Expose()
  firstName: string;
  @Column()
  @Expose()
  lastName: string;
  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}
