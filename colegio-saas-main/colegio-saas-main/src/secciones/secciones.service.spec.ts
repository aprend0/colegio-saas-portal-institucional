import { Test, TestingModule } from '@nestjs/testing';
import { SeccionesService } from './secciones.service';

describe('SeccionesService', () => {
  let service: SeccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeccionesService],
    }).compile();

    service = module.get<SeccionesService>(SeccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
