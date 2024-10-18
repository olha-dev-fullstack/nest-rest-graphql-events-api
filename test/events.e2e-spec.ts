import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import {
  loadFixtures as loadFixturesBase,
  tokenForUser as tokenForUserBase,
} from './utils';
import { User } from 'src/user/user.entity';

let app: INestApplication;
let mod: TestingModule;
let dataSource: DataSource;

const loadFixtures = async (sqlFileName: string) =>
  loadFixturesBase(dataSource, sqlFileName);

const tokenForUser = (
  user: Partial<User> = {
    id: 'bc9ec78c-7423-4d54-8125-204d503fb203',
    username: 'e2e-test',
  },
): string => tokenForUserBase(app, user);

describe('Events (e2e)', () => {
  beforeEach(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
  });
  afterEach(async () => {
    await app.close();
  });

  it('should return an empty list of events', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(0);
      });
  });

  it('should return a single event', async () => {
    await loadFixtures('1-event-1-user.sql');
    return request(app.getHttpServer())
      .get('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe('3cec8c71-853a-4fc5-ba44-6758919e005f');
        expect(response.body.name).toBe('Interesting Party');
      });
  });

  it('should return a list of (2) events', async () => {
    await loadFixtures('2-events-1-user.sql');
    return request(app.getHttpServer())
      .get(`/events`)
      .expect(200)
      .then((response) => {
        expect(response.body.first).toBe(1);
        expect(response.body.last).toBe(2);
        expect(response.body.limit).toBe(2);
        expect(response.body.total).toBe(2);
      });
  });
  it('should throw a an error when creating event being unauthenticated', () => {
    return request(app.getHttpServer()).post('/events').send({}).expect(401);
  });

  it('should throw an error when creating event with wrong input', async () => {
    await loadFixtures('1-user.sql');
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: [
            'Wrong name length',
            'description must be longer than or equal to 5 characters',
            'when must be a valid ISO 8601 date string',
            'address must be longer than or equal to 5 characters',
          ],
          error: 'Bad Request',
        });
      });
  });
  it('should create an event', async () => {
    await loadFixtures('1-user.sql');
    const when = new Date().toISOString();
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        id: '3cec8c71-853a-4fc5-ba44-6758919e005f',
        name: 'E2e Event',
        description: 'A fake event from e2e tests',
        when,
        address: 'Street 123',
      })
      .expect(201)
      .then((_) => {
        return request(app.getHttpServer())
          .get('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              id: '3cec8c71-853a-4fc5-ba44-6758919e005f',
              name: 'E2e Event',
              description: 'A fake event from e2e tests',
              address: 'Street 123',
            });
          });
      });
  });
  it('should throw an error when changing non existing event', () => {
    return request(app.getHttpServer())
      .put('/events/100')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({})
      .expect(404);
  });
  it('should throw an error when changing an event of other user', async () => {
    await loadFixtures('1-event-2-users.sql');
    return request(app.getHttpServer())
      .patch('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
      .set(
        'Authorization',
        `Bearer ${tokenForUser({ id: '45217304-3dae-42cd-969e-44e3a94bcd33', username: 'nasty' })}`,
      )
      .send({
        name: 'Updated event name',
      })
      .expect(403);
  });
  it('should update an event name', async () => {
    await loadFixtures('1-event-1-user.sql');
    return request(app.getHttpServer())
      .patch('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .send({
        name: 'Updated event name',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe('Updated event name');
      });
  });
  it('should remove an event', async () => {
    await loadFixtures('1-event-1-user.sql');
    return request(app.getHttpServer())
      .delete('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(204)
      .then((response) => {
        return request(app.getHttpServer())
          .get('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
          .expect(404);
      });
  });
  it('should throw an error when removing an event of other user', async () => {
    await loadFixtures('1-event-2-users.sql');
    return request(app.getHttpServer())
      .delete('/events/3cec8c71-853a-4fc5-ba44-6758919e005f')
      .set(
        'Authorization',
        `Bearer ${tokenForUser({ id: '45217304-3dae-42cd-969e-44e3a94bcd33', username: 'nasty' })}`,
      )
      .expect(403);
  });
  it('should throw an error when removing non existing event', async () => {
    await loadFixtures('1-user.sql');
    return request(app.getHttpServer())
      .delete('/events/45217304-3dae-42cd-969e-44e3a94bcd33')
      .set('Authorization', `Bearer ${tokenForUser()}`)
      .expect(404);
  });
});
