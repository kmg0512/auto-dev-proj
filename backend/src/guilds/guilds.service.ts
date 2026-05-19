import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../prisma/redis.service';

@Injectable()
export class GuildsService implements OnModuleInit {
  private hpCache: Map<string, number> = new Map();
  private readonly BUFFER_KEY = 'guild:damage_buffer';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  onModuleInit() {
    // Periodic flush every 5 seconds to optimize DB writes (Write-behind pattern)
    setInterval(() => this.flushDamageBuffer().catch(err => console.error('Flush error:', err)), 5000);
  }

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

  async inviteUser(guildId: string, userId: string) {
    return this.prisma.guildInvitation.create({
      data: {
        guildId,
        userId,
        status: 'PENDING',
      },
    });
  }

  async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await this.prisma.guildInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.userId !== userId || invitation.status !== 'PENDING') {
      throw new Error('Invalid invitation');
    }

    const updatedInvitation = await this.prisma.guildInvitation.update({
      where: { id: invitationId },
      data: { status: 'ACCEPTED' },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { guildId: invitation.guildId },
    });

    return updatedInvitation;
  }

  async rejectInvitation(invitationId: string, userId: string) {
    const invitation = await this.prisma.guildInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.userId !== userId || invitation.status !== 'PENDING') {
      throw new Error('Invalid invitation');
    }

    return this.prisma.guildInvitation.update({
      where: { id: invitationId },
      data: { status: 'REJECTED' },
    });
  }

  async getGuildMembers(guildId: string) {
    return this.prisma.user.findMany({
      where: { guildId },
      select: {
        id: true,
        name: true,
        level: true,
        exp: true,
      },
    });
  }

  async getGuildBossHp(guildId: string): Promise<number> {
    // Check local cache first for low-latency feedback
    if (this.hpCache.has(guildId)) {
      return this.hpCache.get(guildId)!;
    }

    const guild = await this.prisma.guild.findUnique({
      where: { id: guildId },
      select: { bossHp: true },
    });

    if (!guild) {
      throw new Error('Guild not found');
    }

    this.hpCache.set(guildId, guild.bossHp);
    return guild.bossHp;
  }

  async attackGuildBoss(guildId: string, damage: number): Promise<number> {
    // Get current HP
    let currentHp = await this.getGuildBossHp(guildId);
    
    // Update Redis buffer (Write-behind source)
    await this.redis.hincrby(this.BUFFER_KEY, guildId, damage);

    // Update local HP cache for immediate feedback
    const newHp = Math.max(0, currentHp - damage);
    this.hpCache.set(guildId, newHp);

    return newHp;
  }

  async flushDamageBuffer() {
    const buffer = await this.redis.hgetall(this.BUFFER_KEY);
    const guildsToUpdate = Object.keys(buffer);
    
    for (const guildId of guildsToUpdate) {
      const damage = parseInt(buffer[guildId], 10);
      if (damage && damage > 0) {
        // Atomic decrement in DB
        await this.prisma.guild.update({
          where: { id: guildId },
          data: {
            bossHp: {
              decrement: damage,
            },
          },
        });
        // Clear buffer for this guild in Redis
        await this.redis.hdel(this.BUFFER_KEY, guildId);
        // Evict local cache to force re-fetch from DB on next request
        this.hpCache.delete(guildId);
      }
    }
  }
}
