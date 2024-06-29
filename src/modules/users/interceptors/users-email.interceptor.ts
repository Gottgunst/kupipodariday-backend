import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RemoveEmailInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<UserEntity>,
  ): Observable<Omit<UserEntity, 'email'>> {
    return next.handle().pipe(
      map((user) => {
        if ('email' in user) {
          const { email, ...res } = user; // eslint-disable-line
          return res;
        }
        return user;
      }),
    );
  }
}
