import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  const ticket = {
    film: '1',
    session: '1',
    daytime: '2026-05-11T18:00:00.000Z',
    row: 1,
    seat: 2,
    price: 1000,
  };

  const order = {
    email: 'test@test.com',
    phone: '+12345678901',
    tickets: [ticket],
  };

  const orderItem = {
    id: '1',
    ...ticket,
  };

  const result = {
    total: 1,
    items: [orderItem],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        createOrder: jest.fn(),
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createOrder() should call OrderService.createOrder', async () => {
    service.createOrder.mockResolvedValue(result);

    await controller.createOrder(order);

    expect(service.createOrder).toHaveBeenCalledWith(order);
  });

  it('createOrder() should return order', async () => {
    service.createOrder.mockResolvedValue(result);

    await expect(controller.createOrder(order)).resolves.toEqual(result);
  });
});
