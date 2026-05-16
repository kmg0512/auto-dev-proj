import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post(':userId/add')
  async add(
    @Param('userId') userId: string,
    @Body('itemName') itemName: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.addItem(userId, itemName, quantity);
  }

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return this.inventoryService.getUserInventory(userId);
  }
}
