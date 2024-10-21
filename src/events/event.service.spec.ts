import { Repository } from 'typeorm';
import { EventsService } from './event.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { User } from '../user/user.entity';
import * as paginator from './../pagination/paginator';

jest.mock('./../pagination/paginator');

describe('EventService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb;
  let deleteQb;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = paginator.paginate as jest.Mock;

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };
    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));

    service.findOne = jest
      .fn()
      .mockImplementation(
        (): any => ({ id: 'test', organizerId: 'testOrgId' }) as Event,
      );
  });

  describe('updateEvent', () => {
    it('should update event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 'test' } as Event);
      await expect(
        service.updateEvent('test', { name: 'New name' }, {
          id: 'testOrgId',
        } as User),
      ).resolves.toEqual({ id: 'test' });
      expect(repoSpy).toHaveBeenCalledWith({
        id: 'test',
        name: 'New name',
        organizerId: 'testOrgId',
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete event with query builder', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        repository,
        'createQueryBuilder',
      );
      const deleteSpy = jest
        .spyOn(selectQb, 'delete')
        .mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      await expect(
        service.deleteEvent('test', { id: 'testOrgId' } as User),
      ).resolves.toBe(undefined);

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 'test' });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const orderBySpy = jest
        .spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);
      const leftJoinSpy = jest
        .spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);
      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);
      mockedPaginate.mockResolvedValue({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });
      await expect(
        service.getEventsAttendedByUserIdPaginated('test', {
          limit: 1,
          currentPage: 1,
        }),
      ).resolves.toEqual({
        data: [],
        first: 1,
        last: 1,
        limit: 10,
        total: 10,
      });
      expect(orderBySpy).toHaveBeenCalledTimes(1);
      expect(orderBySpy).toHaveBeenCalledWith('e.id', 'DESC');
      expect(leftJoinSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinSpy).toHaveBeenCalledWith('e.attendees', 'a');
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('a.userId = :userId', {
        userId: 'test',
      });
      expect(mockedPaginate).toHaveBeenCalledTimes(1);
      expect(mockedPaginate).toHaveBeenCalledWith(selectQb, {
        currentPage: 1,
        limit: 1,
      });
    });
  });
});
