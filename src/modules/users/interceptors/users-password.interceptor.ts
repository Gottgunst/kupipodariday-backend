import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<UserEntity>,
  ): Observable<Omit<UserEntity, 'password'>> {
    return next.handle().pipe(
      map((user) => {
        if ('password' in user) {
          const { password, ...res } = user; // eslint-disable-line
          return res;
        }
        return user;
      }),
    );
  }
}
