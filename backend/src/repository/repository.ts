import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class Repository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<FilmDocument> {
    const film = await this.filmModel.findOne({ id }).exec();
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

    await film.save();
  }
}
