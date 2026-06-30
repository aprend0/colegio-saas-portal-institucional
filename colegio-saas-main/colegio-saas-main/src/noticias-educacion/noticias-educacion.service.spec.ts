import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasEducacionService } from './noticias-educacion.service';

describe('NoticiasEducacionService', () => {
  let service: NoticiasEducacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticiasEducacionService],
    }).compile();

    service = module.get<NoticiasEducacionService>(NoticiasEducacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
