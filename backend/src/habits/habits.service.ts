import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit, Prisma } from '@prisma/client';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.HabitCreateInput): Promise<Habit> {
    return this.prisma.habit.create({
      data,
    });
  }

  async findAll(userId: string): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
    });
  }

  async findOne(id: string): Promise<Habit | null> {
    return this.prisma.habit.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit> {
    return this.prisma.habit.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Habit> {
    return this.prisma.habit.delete({
      where: { id },
    });
  }

  async recoverStreak(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        streak: {
          increment: 1,
        },
      },
    });
  }
}
