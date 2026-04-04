import { FilmDocument } from './schemas/film.schema';
import { FilmDto, ScheduleDto } from './dto/films.dto';

export class FilmsConverter {
  static toScheduleDto(
    schedule: FilmDocument['schedule'][number],
  ): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  static toFilmDto(film: FilmDocument): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule.map((item) => this.toScheduleDto(item)),
    };
  }
}
