import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestsService {
  constructor(private prisma: PrismaService) {}

  async generateQuestFromHabit(habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${habitId} not found`);
    }

    // Mocked AI transformation logic
    const title = `The Quest for ${habit.title}`;
    const description = `In a realm far away, you must fulfill your destiny by: ${habit.title}.`;

    return this.prisma.quest.create({
      data: {
        title,
        description,
        userId: habit.userId,
      },
    });
  }
}
