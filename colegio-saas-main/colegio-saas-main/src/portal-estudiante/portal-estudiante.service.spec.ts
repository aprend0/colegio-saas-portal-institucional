import { Test, TestingModule } from '@nestjs/testing';
import { PortalEstudianteService } from './portal-estudiante.service';

describe('PortalEstudianteService', () => {
  let service: PortalEstudianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortalEstudianteService],
    }).compile();

    service = module.get<PortalEstudianteService>(PortalEstudianteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
