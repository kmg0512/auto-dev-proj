import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit: string) {
    const users = await this.usersService.getTopUsers(limit ? parseInt(limit, 10) : 10);
    return users.map(user => ({
      id: user.id,
      name: user.name,
      level: user.level,
      exp: user.exp,
    }));
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      name: user.name,
      level: user.level,
      exp: user.exp,
    };
  }
}
