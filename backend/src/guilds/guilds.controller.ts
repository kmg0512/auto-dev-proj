import { Controller, Post, Body, Param, Put, Get } from '@nestjs/common';
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

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.guildsService.getGuildMembers(id);
  }
}
