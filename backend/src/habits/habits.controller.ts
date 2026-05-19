import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { Prisma } from '@prisma/client';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body() createHabitDto: Prisma.HabitCreateInput) {
    return this.habitsService.create(createHabitDto);
  }

  @Get('user/:userId')
  findAll(@Param('userId') userId: string) {
    return this.habitsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: Prisma.HabitUpdateInput) {
    return this.habitsService.update(id, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitsService.remove(id);
  }
  
  @Post(':userId/recover-streak')
  recoverStreak(@Param('userId') userId: string) {
    return this.habitsService.recoverStreak(userId);
  }
}
