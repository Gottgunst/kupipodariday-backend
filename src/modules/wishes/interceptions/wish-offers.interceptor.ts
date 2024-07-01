import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { WishEntity } from '../entities/wish.entity';

@Injectable()
export class FilterOffersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<WishEntity>) {
    const filterHiddenOffers = (wish: WishEntity) => {
      const { offers } = wish;
      if (offers) {
        wish.offers = wish.offers.filter((offer) => !offer.hidden);
      }
      return wish;
    };

    return next.handle().pipe(
      map((wishes) => {
        if (Array.isArray(wishes)) {
          return wishes.map((wish) => filterHiddenOffers(wish));
        }
        return filterHiddenOffers(wishes);
      }),
    );
  }
}
