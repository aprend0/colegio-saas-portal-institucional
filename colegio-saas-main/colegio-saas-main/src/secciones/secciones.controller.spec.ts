import { Test, TestingModule } from '@nestjs/testing';
import { SeccionesController } from './secciones.controller';

describe('SeccionesController', () => {
  let controller: SeccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeccionesController],
    }).compile();

    controller = module.get<SeccionesController>(SeccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
