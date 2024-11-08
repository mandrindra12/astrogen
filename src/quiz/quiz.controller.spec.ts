import { Test, TestingModule } from '@nestjs/testing';
import { QuizzController } from './quiz.controller';
import { QuizzService } from './quiz.service';

describe('QuizzController', () => {
  let controller: QuizzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzController],
      providers: [QuizzService],
    }).compile();

    controller = module.get<QuizzController>(QuizzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
