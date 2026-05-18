import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit, Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { GuildsService } from '../guilds/guilds.service';

@Injectable()
export class HabitsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private guildsService: GuildsService,
  ) {}

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

  async completeHabit(habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
      include: { user: true },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${habitId} not found`);
    }

    // 1. Add Experience to User
    await this.usersService.addExperience(habit.userId, 10);

    // 2. Attack Guild Boss if user is in a guild
    if (habit.user.guildId) {
      await this.guildsService.attackGuildBoss(habit.user.guildId, 5);
    }

    return habit;
  }
}
