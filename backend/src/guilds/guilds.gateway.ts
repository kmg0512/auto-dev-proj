import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GuildsService } from './guilds.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GuildsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly guildsService: GuildsService) {}

  @SubscribeMessage('joinGuildRaid')
  handleJoinRaid(
    @MessageBody() guildId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`guild_raid_${guildId}`);
    return { event: 'joinedRaid', data: guildId };
  }

  @SubscribeMessage('joinGuildChat')
  handleJoinChat(
    @MessageBody() guildId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`guild_chat_${guildId}`);
    return { event: 'joinedChat', data: guildId };
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(
    @MessageBody() data: { guildId: string; message: string; userId: string; userName: string },
  ) {
    const chatRoom = `guild_chat_${data.guildId}`;
    const payload = {
      userId: data.userId,
      userName: data.userName,
      message: data.message,
      timestamp: new Date().toISOString(),
    };

    this.server.to(chatRoom).emit('chatMessage', payload);

    return { event: 'messageSent', data: data.message };
  }

  @SubscribeMessage('attackBoss')
  async handleAttackBoss(
    @MessageBody() data: { guildId: string; damage: number; userId: string },
  ) {
    const newHp = await this.guildsService.attackGuildBoss(
      data.guildId,
      data.damage,
    );

    this.server.to(`guild_raid_${data.guildId}`).emit('bossAttacked', {
      userId: data.userId,
      damage: data.damage,
    });

    this.server.to(`guild_raid_${data.guildId}`).emit('bossHpUpdated', {
      newHp: newHp,
    });

    if (newHp <= 0) {
      await this.guildsService.distributeRaidRewards(data.guildId, 1000);

      this.server.to(`guild_raid_${data.guildId}`).emit('bossDefeated', {
        guildId: data.guildId,
        defeatedBy: data.userId,
      });
    }

    return {
      event: 'attackAcknowledged',
      data: { damage: data.damage, newHp: newHp },
    };
  }
}
