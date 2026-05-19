import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async addExperience(userId: string, expToAdd: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let newExp = user.exp + expToAdd;
    let newLevel = user.level;

    while (newExp >= 100) {
      newExp -= 100;
      newLevel += 1;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        exp: newExp,
        level: newLevel,
      },
    });
  }

  async getTopUsers(limit: number = 10): Promise<User[]> {
    return this.prisma.user.findMany({
      take: limit,
      orderBy: [
        { level: 'desc' },
        { exp: 'desc' },
      ],
    });
  }
}
