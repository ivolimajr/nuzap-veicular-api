import { Test, TestingModule } from '@nestjs/testing';
import { VeiculoAppService } from './veiculo-app.service';

describe('VeiculoService', () => {
  let service: VeiculoAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeiculoAppService],
    }).compile();

    service = module.get<VeiculoAppService>(VeiculoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
