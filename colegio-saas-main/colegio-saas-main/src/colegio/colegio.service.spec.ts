import { Test, TestingModule } from '@nestjs/testing';
import { ColegioService } from './colegio.service';

describe('ColegioService', () => {
  let service: ColegioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColegioService],
    }).compile();

    service = module.get<ColegioService>(ColegioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
