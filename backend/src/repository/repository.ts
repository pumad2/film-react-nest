import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Film } from 'src/films/entities/film.entity';
import { Schedule } from 'src/films/entities/schedule.entity';

@Injectable()
export class Repository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: TypeOrmRepository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: TypeOrmRepository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      relations: {
        schedule: true,
      },
    });
  }

  async findById(id: string): Promise<Film | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
    });
    return film;
  }

  async reserveSeats(
    filmId: string,
    scheduleId: string,
    reservedSeats: Array<{ row: number; seat: number }>,
  ): Promise<'FILM_NOT_FOUND' | 'SCHEDULE_NOT_FOUND' | 'SEAT_TAKEN' | null> {
    const film = await this.findById(filmId);
    if (!film) return 'FILM_NOT_FOUND';

    const scheduleItem = film.schedule.find((item) => item.id === scheduleId);
    if (!scheduleItem) return 'SCHEDULE_NOT_FOUND';

    const seatKeys = reservedSeats.map((item) => `${item.row}:${item.seat}`);

    for (const seatKey of seatKeys) {
      if (scheduleItem.taken.includes(seatKey)) return 'SEAT_TAKEN';
    }

    scheduleItem.taken.push(...seatKeys);

    await this.scheduleRepository.save(scheduleItem);

    return null;
  }
}
