import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasEducacionController } from './noticias-educacion.controller';

describe('NoticiasEducacionController', () => {
  let controller: NoticiasEducacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticiasEducacionController],
    }).compile();

    controller = module.get<NoticiasEducacionController>(NoticiasEducacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
