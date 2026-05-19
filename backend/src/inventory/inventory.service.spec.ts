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

  describe('useItem', () => {
    it('should decrease item quantity', async () => {
      const id = 'inv-1';
      const item = { id, itemName: 'Potion', quantity: 2 };
      const updatedItem = { ...item, quantity: 1 };

      mockPrismaService.inventory.findUnique.mockResolvedValue(item);
      mockPrismaService.inventory.update.mockResolvedValue(updatedItem);

      const result = await service.useItem(id);
      expect(result.quantity).toBe(1);
      expect(prisma.inventory.update).toHaveBeenCalledWith({
        where: { id },
        data: { quantity: { decrement: 1 } },
      });
    });

    it('should delete item if quantity reaches 0', async () => {
      const id = 'inv-2';
      const item = { id, itemName: 'Potion', quantity: 1 };

      mockPrismaService.inventory.findUnique.mockResolvedValue(item);
      mockPrismaService.inventory.delete.mockResolvedValue({ id });

      const result = await service.useItem(id);
      expect(result).toEqual({ success: true, deleted: true });
      expect(prisma.inventory.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw error if item not found', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue(null);

      await expect(service.useItem('invalid')).rejects.toThrow('Item not found');
    });
  });
});
