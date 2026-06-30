import { Test, TestingModule } from '@nestjs/testing';
import { ColegioController } from './colegio.controller';

describe('ColegioController', () => {
  let controller: ColegioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColegioController],
    }).compile();

    controller = module.get<ColegioController>(ColegioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
