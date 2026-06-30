import { Test, TestingModule } from '@nestjs/testing';
import { MatriculasController } from './matriculas.controller';

describe('MatriculasController', () => {
  let controller: MatriculasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatriculasController],
    }).compile();

    controller = module.get<MatriculasController>(MatriculasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
