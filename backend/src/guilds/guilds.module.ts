import { Module } from '@nestjs/common';
import { GuildsService } from './guilds.service';
import { GuildsController } from './guilds.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GuildsGateway } from './guilds.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [GuildsController],
  providers: [GuildsService, GuildsGateway],
  exports: [GuildsService],
})
export class GuildsModule {}
