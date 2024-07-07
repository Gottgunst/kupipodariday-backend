import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Not,
  Repository,
} from 'typeorm';
import { OfferEntity, UserEntity, WishEntity } from '../entities.index';
import { CreateWishDto, UpdateWishDto } from './dto';
import { UserId } from 'src/common/types';
import {
  UserAlreadyHaveWishException,
  UserIsNotOwnerException,
  WishIsNotExistException,
} from './exceptions';
import { WishHasOffersException } from './exceptions/wish-has-offers.exception';
import { UserPublicProfileResponseDto } from '../users/dto';

// #####################################
// #####################################
// #####################################

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(WishEntity)
    private wishesRepository: Repository<WishEntity>,
    private dataSource: DataSource,
  ) {}

  // ======================================

  async create(
    createWishDto: CreateWishDto,
    user: UserPublicProfileResponseDto,
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
    query: FindOneOptions,
    userId: UserId,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesRepository.findOne(query);

    this.isExist(wish);
    this.isOwner(wish.owner.id, userId);
    this.hasOffers(wish.offers, updateWishDto.price);

    updateWishDto['id'] = wish.id;

    return await this.wishesRepository.save(updateWishDto);
  }

  // ======================================

  async deleteOne(query: FindOneOptions, userId: UserId) {
    const wish = await this.wishesRepository.findOne(query);

    this.isExist(wish);
    this.isOwner(wish.owner.id, userId);

    await this.wishesRepository.delete(wish.id);

    const { id, owner, ...delWish } = wish; //eslint-disable-line
    return delWish;
  }

  // ======================================

  async copyOne(query: FindOneOptions, user: UserEntity) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ####################

      const wish = await queryRunner.manager.findOne(WishEntity, query);
      this.isExist(wish);

      // ####################

      const double = await queryRunner.manager.findOne(WishEntity, {
        where: [
          { owner: { id: user.id }, id: wish.id },
          { owner: { id: user.id }, parentId: wish.id },
          { owner: { id: user.id }, parentId: And(wish.parentId, Not(0)) },
        ],
        relations: ['owner'],
      });

      this.isDouble(double);

      // ####################

      const { id, copied, ...wishCopy } = wish; //eslint-disable-line
      let parentId = id;

      if (wish.parentId === 0) {
        wish.copied++;
      } else {
        const parentWish = await queryRunner.manager.findOne(WishEntity, {
          where: { id: wish.parentId },
          select: ['id', 'copied'],
        });
        if (!parentWish) {
          wish.copied++;
          wish.parentId = 0;
        } else {
          parentId = parentWish.id;
          parentWish.copied++;
          await queryRunner.manager.save(WishEntity, parentWish);
        }
      }
      // ####################

      await queryRunner.manager.save(WishEntity, wish);
      const newWish = await queryRunner.manager.save(WishEntity, {
        ...wishCopy,
        owner: user,
        parentId,
      });

      await queryRunner.commitTransaction();
      return newWish;

      // ####################
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ======================================

  async findMany(query: FindManyOptions) {
    const wishes = await this.wishesRepository.find(query);

    this.isExist(wishes);

    return wishes;
  }

  // ======================================

  private hasOffers(
    offers: OfferEntity[],
    price: UpdateWishDto['price'] | null,
  ): void {
    if (offers.length > 0 && price) throw new WishHasOffersException();
  }

  private isExist(wish: WishEntity | WishEntity[] | null): void {
    if (!wish) throw new WishIsNotExistException();
    if (Array.isArray(wish)) {
      wish.map((w) => this.isExist(w));
    }
  }

  private isDouble(wish: WishEntity | null): void {
    if (wish) throw new UserAlreadyHaveWishException();
  }

  private isOwner(wishOwnerId: UserId, userId: UserId): void {
    if (wishOwnerId !== userId) throw new UserIsNotOwnerException();
  }

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
