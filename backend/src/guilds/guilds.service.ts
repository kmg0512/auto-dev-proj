import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuildsService {
  constructor(private prisma: PrismaService) {}

  async createGuild(name: string) {
    return this.prisma.guild.create({
      data: { name },
    });
  }

  async joinGuild(userId: string, guildId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { guildId },
    });
  }

  async getGuildBossHp(guildId: string): Promise<number> {
    const guild = await this.prisma.guild.findUnique({
      where: { id: guildId },
      select: { bossHp: true },
    });

    if (!guild) {
      throw new Error('Guild not found');
    }

    return guild.bossHp;
  }

  async attackGuildBoss(guildId: string, damage: number): Promise<number> {
    const updatedGuild = await this.prisma.guild.update({
      where: { id: guildId },
      data: {
        bossHp: {
          decrement: damage,
        },
      },
    });

    return updatedGuild.bossHp;
  }
}
