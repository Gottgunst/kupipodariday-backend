import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OfferEntity, UserEntity, WishEntity } from '../entities.index';
import { CreateWishDto, UpdateWishDto } from './dto';
import { UserId, WishId } from 'src/common/types';
import { UserIsNotOwnerException, WishIsNotExistException } from './exceptions';
import { WishHasOffersException } from './exceptions/wish-has-offers.exception';

// #####################################
// #####################################
// #####################################

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(WishEntity)
    private wishesRepository: Repository<WishEntity>,
  ) {}

  // ======================================

  async create(
    createWishDto: CreateWishDto,
    user: UserEntity,
  ): Promise<WishEntity> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });

    return await this.wishesRepository.save(wish);
  }

  // ======================================

  findPopular(): Promise<WishEntity[]> {
    return this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC', name: 'ASC' },
      relations: {
        owner: true,
        offers: { user: { wishes: true, wishlists: true, offers: true } },
      },
    });
  }
  // ======================================

  findLast(): Promise<WishEntity[]> {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC', name: 'ASC' },
      relations: {
        owner: true,
        offers: { user: { wishes: true, wishlists: true, offers: true } },
      },
    });
  }

  // ======================================

  async findOne(query: FindOneOptions) {
    const wish = await this.wishesRepository.findOne(query);

    this.isExist(wish);

    return wish;
  }

  // ======================================

  async updateOne(
    wishId: WishId,
    userId: UserId,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner', 'offers'],
    });

    this.isExist(wish);
    this.isOwner(wish.owner.id, userId);
    this.hasOffers(wish.offers, updateWishDto.price);

    updateWishDto['id'] = wishId;

    return await this.wishesRepository.save(updateWishDto);
  }

  // ======================================

  async removeOne(wishId: WishId, userId: UserId) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
      select: ['id', 'name', 'link', 'image', 'price', 'description'],
    });

    this.isExist(wish);
    this.isOwner(wish.owner.id, userId);

    await this.wishesRepository.delete(wish.id);

    const { id, owner, ...delWish } = wish; //eslint-disable-line
    return delWish;
  }

  // ======================================

  async duplicateOne(wishId: WishId, user: UserEntity) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      select: [
        'id',
        'name',
        'link',
        'image',
        'price',
        'description',
        'copied',
        'parentId',
      ],
      relations: ['owner'],
    });
    this.isExist(wish);
    const { id, copied, ...wishCopy } = wish; //eslint-disable-line
    let parentId = id;

    if (wish.parentId === 0) {
      wish.copied++;
    } else {
      const parentWish = await this.wishesRepository.findOne({
        where: { id: wish.parentId },
        select: ['id', 'copied'],
      });

      if (!parentWish) {
        wish.copied++;
        wish.parentId = 0;
      } else {
        parentId = parentWish.id;
        parentWish.copied++;
        await this.wishesRepository.save(parentWish);
      }
    }

    await this.wishesRepository.save(wish);
    return this.wishesRepository.save({
      ...wishCopy,
      owner: user,
      parentId,
    });
  }

  // ======================================

  private hasOffers(
    offers: OfferEntity[],
    price: UpdateWishDto['price'] | null,
  ): void {
    if (offers.length > 0 && price) throw new WishHasOffersException();
  }

  private isExist(wish: WishEntity | null): void {
    if (!wish) throw new WishIsNotExistException();
  }

  private isOwner(wishOwnerId: UserId, userId: UserId): void {
    if (wishOwnerId !== userId) throw new UserIsNotOwnerException();
  }

  // ======================================

  async donate(wish: WishEntity, amount: number) {
    wish.raised += amount;
    return this.wishesRepository.save(wish);
  }

  // ======================================

  // findMany(query: FindManyOptions) {
  //   return this.wishesRepository.find(query);
  // }

  // ======================================

  // async findAll(query: {
  //   page: number;
  //   limit: number;
  // }): Promise<IWishesPaginator> {
  //   const skip = (query.page - 1) * query.limit;
  //   const [data, totalCount] = await this.wishesRepository.findAndCount({
  //     take: query.limit,
  //     skip,
  //   });
  //   const totalPage = Math.ceil(totalCount / query.limit);
  //   return {
  //     data,
  //     page: query.page,
  //     size: query.limit,
  //     totalCount,
  //     totalPage,
  //   };
  // }
}
