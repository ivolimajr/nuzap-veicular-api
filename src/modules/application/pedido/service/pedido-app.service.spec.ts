import { Test, TestingModule } from '@nestjs/testing';
import { PedidoAppService } from './pedido-app.service';

describe('PedidoAppService', () => {
  let service: PedidoAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoAppService],
    }).compile();

    service = module.get<PedidoAppService>(PedidoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
