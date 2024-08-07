import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../user/entity/user.entity';
import { CourseEntity } from '../course/entity/course.entity';

export class ResponseCoursesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) =>
        data.map((item: CourseEntity) => {
          const res = {
            ...item,
          };
          delete res.user.password;
          return res;
        }),
      ),
    );
  }
}
