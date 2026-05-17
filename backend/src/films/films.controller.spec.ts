import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

  const schedule = {
    id: '1',
    daytime: '2026-05-11T18:00:00.000Z',
    hall: 1,
    rows: 10,
    seats: 100,
    price: 1000,
    taken: ['1:1', '1:2'],
  };

  const filmsResult = {
    total: 1,
    items: [
      {
        id: '1',
        rating: 2,
        director: 'Директор',
        tags: ['тест'],
        image: 'image.jpg',
        cover: 'cover.jpg',
        title: 'Название',
        about: 'О фильме',
        description: 'Описание',
        schedule: [],
      },
    ],
  };

  const scheduleResult = {
    total: 1,
    items: [schedule],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        findAll: jest.fn(),
        getSchedule: jest.fn(),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getFilms() should call FilmsService.findAll', async () => {
    service.findAll.mockResolvedValue(filmsResult);
    await controller.getFilms();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('getFilms() should return film list', async () => {
    service.findAll.mockResolvedValue(filmsResult);
    await expect(controller.getFilms()).resolves.toEqual(filmsResult);
  });

  it('getFilmById() should call FilmsService.getSchedule', async () => {
    service.getSchedule.mockResolvedValue(scheduleResult);
    await controller.getFilmById('1');
    expect(service.getSchedule).toHaveBeenCalledWith('1');
  });

  it('getFilmById() should return schedule', async () => {
    service.getSchedule.mockResolvedValue(scheduleResult);
    await expect(controller.getFilmById('1')).resolves.toEqual(scheduleResult);
  });
});
