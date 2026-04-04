import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsListResponseDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmById(@Param('id') id: string): Promise<ScheduleListResponseDto> {
    return this.filmsService.getSchedule(id);
  }
}
