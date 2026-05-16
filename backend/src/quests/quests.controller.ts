import { Controller, Post, Param } from '@nestjs/common';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post('generate/:habitId')
  async generate(@Param('habitId') habitId: string) {
    return this.questsService.generateQuestFromHabit(habitId);
  }
}
