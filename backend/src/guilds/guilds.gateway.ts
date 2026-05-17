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

  @SubscribeMessage('attackBoss')
  async handleAttackBoss(
    @MessageBody() data: { guildId: string; damage: number; userId: string },
  ) {
    // In a real implementation, we would update the boss HP in Redis/DB via guildsService
    // For now, we broadcast the damage to all members in the guild raid room
    this.server.to(`guild_raid_${data.guildId}`).emit('bossAttacked', {
      userId: data.userId,
      damage: data.damage,
    });
    
    return { event: 'attackAcknowledged', data: { damage: data.damage } };
  }
}
