// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, map } from 'rxjs';
// import { OfferEntity } from 'src/modules/entities.index';

// @Injectable()
// export class RemoveEmailInWishUserInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<OfferEntity[]>,
//   ): Observable<any> {
//     return next.handle().pipe(
//       map((offers) => {
//         return offers.map((offer) => {
//           if ('email' in offer.user) {
//             const { email, ...res } = offer.user; // eslint-disable-line
//             return { ...offer, user: res };
//           }
//           return offer;
//         });
//       }),
//     );
//   }
// }
