import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';
import { Repository } from '../repository/repository';
import { FilmsConverter } from './films.converter';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: Repository) {}

  async findAll(): Promise<FilmsListResponseDto> {
    const films = await this.repository.findAll();
    const items = films.map((film) => FilmsConverter.toFilmDto(film));
    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(id: string): Promise<ScheduleListResponseDto> {
    const film = await this.repository.findById(id);
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }
    return {
      total: film.schedule.length,
      items: film.schedule.map((item) => FilmsConverter.toScheduleDto(item)),
    };
  }
}
