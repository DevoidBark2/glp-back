import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../user/entity/user.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class EventLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly eventService: EventsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('req', request);
    const user: User = request['user'];
    const logAction = this.reflector.get('logAction', context.getHandler());

    console.log('Action', logAction);
    console.log(user);
    if (logAction && user) {
      const { action, description } = logAction;
      return next.handle().pipe(
        tap(async () => {
          await this.eventService.createEvent(user, action, description);
        }),
      );
    }

    return next.handle();
  }
}
