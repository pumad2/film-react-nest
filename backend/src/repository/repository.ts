import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    return film;
  }

  async reserveSeats(
    filmId: string,
    scheduleId: string,
    reservedSeats: Array<{ row: number; seat: number }>,
  ): Promise<void> {
    const film = await this.findById(filmId);
    const scheduleItem = film.schedule.find((item) => item.id === scheduleId);
    if (!scheduleItem) {
      throw new NotFoundException('Сеанс не найден');
    }

    const seatKeys = reservedSeats.map((item) => `${item.row}:${item.seat}`);

    for (const seatKey of seatKeys) {
      if (scheduleItem.taken.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} уже занято`);
      }
    }

    scheduleItem.taken.push(...seatKeys);

    await film.save();
  }
}
