import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuildsService implements OnModuleInit {
  private damageBuffer: Map<string, number> = new Map();
  private hpCache: Map<string, number> = new Map();

  constructor(private prisma: PrismaService) {}

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

  async getGuildBossHp(guildId: string): Promise<number> {
    // Check cache first
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
    // Get current HP (from cache or DB)
    let currentHp = await this.getGuildBossHp(guildId);
    
    // Update buffer
    const bufferedDamage = (this.damageBuffer.get(guildId) || 0) + damage;
    this.damageBuffer.set(guildId, bufferedDamage);

    // Update HP cache
    const newHp = Math.max(0, currentHp - damage);
    this.hpCache.set(guildId, newHp);

    return newHp;
  }

  async flushDamageBuffer() {
    const guildsToUpdate = Array.from(this.damageBuffer.keys());
    
    for (const guildId of guildsToUpdate) {
      const damage = this.damageBuffer.get(guildId);
      if (damage && damage > 0) {
        await this.prisma.guild.update({
          where: { id: guildId },
          data: {
            bossHp: {
              decrement: damage,
            },
          },
        });
        // Clear buffer for this guild
        this.damageBuffer.delete(guildId);
      }
    }
  }
}
