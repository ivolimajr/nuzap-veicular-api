import { Test, TestingModule } from '@nestjs/testing';
import { CotacaoAppService } from './cotacao-app.service';

describe('CotacaoAppService', () => {
  let service: CotacaoAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CotacaoAppService],
    }).compile();

    service = module.get<CotacaoAppService>(CotacaoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
