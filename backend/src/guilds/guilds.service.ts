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
}
