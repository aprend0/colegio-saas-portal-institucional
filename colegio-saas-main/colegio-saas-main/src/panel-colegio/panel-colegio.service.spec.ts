import { Test, TestingModule } from '@nestjs/testing';
import { PanelColegioService } from './panel-colegio.service';

describe('PanelColegioService', () => {
  let service: PanelColegioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelColegioService],
    }).compile();

    service = module.get<PanelColegioService>(PanelColegioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
