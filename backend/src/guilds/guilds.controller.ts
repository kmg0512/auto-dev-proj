import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { GuildsService } from './guilds.service';

@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.guildsService.createGuild(name);
  }

  @Put(':id/join')
  async join(@Param('id') id: string, @Body('userId') userId: string) {
    return this.guildsService.joinGuild(userId, id);
  }

  @Post('leave')
  async leave(@Body('userId') userId: string) {
    return this.guildsService.leaveGuild(userId);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.guildsService.getGuildMembers(id);
  }

  @Get(':id/raid-status')
  async getRaidStatus(@Param('id') id: string) {
    const bossHp = await this.guildsService.getGuildBossHp(id);
    return { guildId: id, bossHp };
  }

  @Get('invitations/:userId')
  async getInvitations(@Param('userId') userId: string) {
    return this.guildsService.getPendingInvitations(userId);
  }

  @Patch(':id')
  async updateSettings(@Param('id') id: string, @Body() data: any) {
    return this.guildsService.updateGuild(id, data);
  }

  @Delete(':id')
  async disband(@Param('id') id: string) {
    return this.guildsService.deleteGuild(id);
  }
}
