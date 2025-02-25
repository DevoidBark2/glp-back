import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AddCoinsForUser, AddXpForUser } from './events/component-task.events';
import { CoinsService } from 'src/coins/coins.service';
import { XpService } from 'src/xp/xp.service';

@Injectable()
export class ComponentTaskListener {
    constructor(
        private readonly coinsService: CoinsService,
        private readonly xpService: XpService
    ) { }

    @OnEvent('coins.added')
    async handleCoinsAdded(event: AddCoinsForUser) {
        await this.coinsService.updateCoinsForUser(event.userId, event.amount);
    }

    @OnEvent('xp.added')
    async handleXpAdded(event: AddXpForUser) {
        await this.xpService.updateXpForUser(event.userId, event.amount);
    }
}
