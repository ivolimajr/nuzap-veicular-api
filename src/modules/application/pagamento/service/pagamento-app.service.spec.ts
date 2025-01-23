import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoAppService } from './pagamento-app.service';

describe('PagamentoAppService', () => {
  let service: PagamentoAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagamentoAppService],
    }).compile();

    service = module.get<PagamentoAppService>(PagamentoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
