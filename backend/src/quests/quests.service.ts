import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../prisma/redis.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class QuestsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private ai: AiService,
  ) {}

  async generateQuestFromHabit(habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${habitId} not found`);
    }

    const cacheKey = `ai:quest:${habit.title}`;
    const cachedQuest = await this.redis.get(cacheKey);

    let questContent: { title: string; description: string };

    if (cachedQuest) {
      questContent = JSON.parse(cachedQuest);
    } else {
      // Call actual AI service
      questContent = await this.ai.generateQuest(habit.title);

      // Cache the result for 1 hour
      await this.redis.set(cacheKey, JSON.stringify(questContent), 3600);
    }

    return this.prisma.quest.create({
      data: {
        title: questContent.title,
        description: questContent.description,
        userId: habit.userId,
      },
    });
  }
}
