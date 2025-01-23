import { Test, TestingModule } from '@nestjs/testing';
import { DebitoAppService } from './debito-app.service';

describe('VeiculoService', () => {
  let service: DebitoAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebitoAppService],
    }).compile();

    service = module.get<DebitoAppService>(DebitoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
