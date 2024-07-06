import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RemoveIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<UserEntity>,
  ): Observable<Omit<UserEntity, 'id'>> {
    return next.handle().pipe(
      map((user) => {
        if ('id' in user) {
          const { id, ...res } = user; // eslint-disable-line
          return res;
        }
        return user;
      }),
    );
  }
}
