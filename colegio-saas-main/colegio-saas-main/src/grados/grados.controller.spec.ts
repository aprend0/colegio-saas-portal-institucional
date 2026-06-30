import { Test, TestingModule } from '@nestjs/testing';
import { GradosController } from './grados.controller';

describe('GradosController', () => {
  let controller: GradosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradosController],
    }).compile();

    controller = module.get<GradosController>(GradosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
