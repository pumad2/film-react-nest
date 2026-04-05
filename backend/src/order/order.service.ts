import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'src/repository/repository';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly repository: Repository) {}
  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    const result = await this.repository.reserveSeats(
      order.tickets[0].film,
      order.tickets[0].session,
      order.tickets.map((ticket) => ({
        row: ticket.row,
        seat: ticket.seat,
      })),
    );
    if (result === 'FILM_NOT_FOUND') {
      throw new NotFoundException('Фильм не найден');
    }

    if (result === 'SCHEDULE_NOT_FOUND') {
      throw new NotFoundException('Сеанс не найден');
    }

    if (result === 'SEAT_TAKEN') {
      throw new BadRequestException('Место уже занято');
    }

    const items: OrderResultDto[] = order.tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }
}
