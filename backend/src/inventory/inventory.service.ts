import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async addItem(userId: string, itemName: string, quantity: number) {
    return this.prisma.inventory.create({
      data: { userId, itemName, quantity },
    });
  }

  async getUserInventory(userId: string) {
    return this.prisma.inventory.findMany({
      where: { userId },
    });
  }

  async useItem(id: string) {
    const item = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    if (item.quantity > 1) {
      return this.prisma.inventory.update({
        where: { id },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    } else {
      await this.prisma.inventory.delete({
        where: { id },
      });
      return { success: true, deleted: true };
    }
  }
}
