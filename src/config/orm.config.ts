import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendee } from './../events/attendee/attendee.entity';
import { Profile } from './../auth/profile.entity';
import { User } from './../user/user.entity';
import { Event } from './../events/event.entity';
import { Teacher } from '../school/teacher.entity';
import { Subject } from '../school/subject.entity';
import { Course } from '../school/course.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, User, Profile, Subject, Teacher, Course],
    synchronize: true,
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
