import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockPrismaService = {
    inventory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItem', () => {
    it('should add an item to user inventory', async () => {
      const userId = 'user-1';
      const itemName = 'Health Potion';
      const quantity = 5;
      const result = { id: 'inv-1', userId, itemName, quantity };

      mockPrismaService.inventory.create.mockResolvedValue(result);

      expect(await service.addItem(userId, itemName, quantity)).toEqual(result);
      expect(prisma.inventory.create).toHaveBeenCalledWith({
        data: { userId, itemName, quantity },
      });
    });
  });

  describe('getUserInventory', () => {
    it('should return all items for a user', async () => {
      const userId = 'user-1';
      const items = [{ id: 'inv-1', userId, itemName: 'Sword', quantity: 1 }];

      mockPrismaService.inventory.findMany.mockResolvedValue(items);

      expect(await service.getUserInventory(userId)).toEqual(items);
      expect(prisma.inventory.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
