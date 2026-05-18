import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { UsersModule } from '../users/users.module';
import { GuildsModule } from '../guilds/guilds.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, GuildsModule],
  providers: [HabitsService],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}
