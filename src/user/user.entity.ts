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
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  @Field()
  id: string;
  @Column({ unique: true })
  @Expose()
  @Field()
  username: string;
  @Column()
  password: string;
  @Column({ unique: true })
  @Expose()
  @Field()
  email: string;
  @Column()
  @Expose()
  @Field()
  firstName: string;
  @Column()
  @Expose()
  @Field()
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
