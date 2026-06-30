import { Test, TestingModule } from '@nestjs/testing';
import { PanelColegioController } from './panel-colegio.controller';

describe('PanelColegioController', () => {
  let controller: PanelColegioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelColegioController],
    }).compile();

    controller = module.get<PanelColegioController>(PanelColegioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
