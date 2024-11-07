import { CallHandler, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CourseEntity } from '../course/entity/course.entity';

export class ResponseCoursesInterceptor implements NestInterceptor {
  intercept(_, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) =>
        data.map((item: CourseEntity) => {
          const res = {
            ...item,
          };
          delete res.secret_key;
          delete res.user.password;
          return res;
        }),
      ),
    );
  }
}
