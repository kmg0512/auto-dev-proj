import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
  let controller: HabitsController;
  let service: HabitsService;

  const mockHabitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: mockHabitsService,
        },
      ],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
    service = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit', async () => {
      const dto = { title: 'Test Habit', userId: 'user-1' };
      mockHabitsService.create.mockResolvedValue({ id: '1', ...dto });
      const result = await controller.create(dto as any);
      expect(result).toEqual({ id: '1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all habits for a user', async () => {
      const userId = 'user-1';
      const habits = [{ id: '1', title: 'Habit 1', userId }];
      mockHabitsService.findAll.mockResolvedValue(habits);
      const result = await controller.findAll(userId);
      expect(result).toEqual(habits);
      expect(service.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a single habit', async () => {
      const id = '1';
      const habit = { id, title: 'Habit 1' };
      mockHabitsService.findOne.mockResolvedValue(habit);
      const result = await controller.findOne(id);
      expect(result).toEqual(habit);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a habit', async () => {
      const id = '1';
      const dto = { title: 'Updated Habit' };
      mockHabitsService.update.mockResolvedValue({ id, ...dto });
      const result = await controller.update(id, dto as any);
      expect(result).toEqual({ id, ...dto });
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a habit', async () => {
      const id = '1';
      mockHabitsService.remove.mockResolvedValue({ id, title: 'Deleted Habit' });
      const result = await controller.remove(id);
      expect(result).toEqual({ id, title: 'Deleted Habit' });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
