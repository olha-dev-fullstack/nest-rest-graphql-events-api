import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from './../events/event.entity';
import { Attendee } from 'src/events/attendee/attendee.entity';
import { User } from 'src/user/user.entity';
import { Profile } from 'src/auth/profile.entity';
import { Subject } from 'src/school/subject.entity';
import { Teacher } from 'src/school/teacher.entity';
import { Course } from 'src/school/course.entity';

export default registerAs(
  'orm.config.prod',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, User, Profile, Subject, Teacher, Course],
    synchronize: false,
    dropSchema: false,
  }),
);
