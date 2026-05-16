import { Test, TestingModule } from '@nestjs/testing';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';

describe('QuestsController', () => {
  let controller: QuestsController;
  let service: QuestsService;

  const mockQuestsService = {
    generateQuestFromHabit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestsController],
      providers: [
        { provide: QuestsService, useValue: mockQuestsService },
      ],
    }).compile();

    controller = module.get<QuestsController>(QuestsController);
    service = module.get<QuestsService>(QuestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate', () => {
    it('should call service.generateQuestFromHabit', async () => {
      const habitId = 'habit-1';
      const result = { id: 'quest-1', title: 'Quest' };
      mockQuestsService.generateQuestFromHabit.mockResolvedValue(result);

      expect(await controller.generate(habitId)).toEqual(result);
      expect(service.generateQuestFromHabit).toHaveBeenCalledWith(habitId);
    });
  });
});
