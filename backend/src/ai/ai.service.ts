import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_testing',
    });
  }

  async generateQuest(habitTitle: string): Promise<{ title: string; description: string }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a gamification AI. Convert the following habit into a fantasy RPG quest. Respond with a JSON object containing "title" and "description" fields.',
          },
          {
            role: 'user',
            content: `Habit: ${habitTitle}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content returned from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      this.logger.error(`Failed to generate quest for habit: ${habitTitle}`, error);
      // Fallback response in case of API failure
      return {
        title: `The Quest for ${habitTitle}`,
        description: `In a realm far away, you must fulfill your destiny by: ${habitTitle}.`,
      };
    }
  }
}
