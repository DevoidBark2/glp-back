import { CallHandler, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class ResponseComponentTaskInterceptor implements NestInterceptor {
  intercept(_, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) => {
        const res = {
          ...data,
        };

        delete res.component.user;
        return res;
      }),
    );
  }
}
