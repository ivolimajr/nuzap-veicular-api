import { Test, TestingModule } from '@nestjs/testing';
import { DebitoService } from './debito.service';

describe('DebitoService', () => {
  let service: DebitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebitoService],
    }).compile();

    service = module.get<DebitoService>(DebitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
