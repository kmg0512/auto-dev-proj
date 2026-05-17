import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const mockInventoryService = {
    addItem: jest.fn(),
    getUserInventory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should call inventoryService.addItem and return the result', async () => {
      const userId = 'user-1';
      const itemName = 'Sword';
      const quantity = 1;
      const expectedResult = { id: 'inv-1', userId, itemName, quantity };

      mockInventoryService.addItem.mockResolvedValue(expectedResult);

      const result = await controller.add(userId, itemName, quantity);

      expect(service.addItem).toHaveBeenCalledWith(userId, itemName, quantity);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('get', () => {
    it('should call inventoryService.getUserInventory and return the result', async () => {
      const userId = 'user-1';
      const expectedResult = [{ id: 'inv-1', userId, itemName: 'Sword', quantity: 1 }];

      mockInventoryService.getUserInventory.mockResolvedValue(expectedResult);

      const result = await controller.get(userId);

      expect(service.getUserInventory).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });
});
