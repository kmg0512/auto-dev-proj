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
}
