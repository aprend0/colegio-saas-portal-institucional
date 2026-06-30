import { Test, TestingModule } from '@nestjs/testing';
import { PortalEstudianteController } from './portal-estudiante.controller';

describe('PortalEstudianteController', () => {
  let controller: PortalEstudianteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortalEstudianteController],
    }).compile();

    controller = module.get<PortalEstudianteController>(PortalEstudianteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
