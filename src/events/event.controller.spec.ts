import { Repository } from 'typeorm';
import { EventsController } from './event.controller';
import { Event } from './event.entity';
import { EventsService } from './event.service';
import { ListEvents } from './input/list.events';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';

describe('EventController', () => {
  let eventController: EventsController;
  let eventService: EventsService;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    eventService = new EventsService(eventRepository);
    eventController = new EventsController(eventService);
  });
  it('should return a list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };
    const spy = jest
      .spyOn(eventService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(await eventController.findAll(new ListEvents())).toEqual(result);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should not delete an event when it's not found", async () => {
    try {
      await eventController.remove('123', new User());
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
});
