import { Injectable } from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { OfferEntity, UserEntity, WishEntity } from '../entities.index';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto';
import {
  OfferIsDoubleException,
  OfferIsNotExistException,
  WishIsYoursException,
} from './exceptions';
import { isArray } from 'class-validator';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(OfferEntity)
    private offerRepository: Repository<OfferEntity>,
    private dataSource: DataSource,
  ) {}

  // ======================================

  async create(
    user: UserEntity,
    createOfferDto: CreateOfferDto,
  ): Promise<OfferEntity> {
    const { itemId, ...newOffer } = createOfferDto; //eslint-disable-line
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ####################

      const wish = await queryRunner.manager.findOne(WishEntity, {
        where: { id: itemId },
        relations: ['owner'],
      });
      if (wish.owner.id === user.id) throw new WishIsYoursException();

      // ####################

      const isDouble = await queryRunner.manager.findOne(OfferEntity, {
        where: { item: { id: itemId }, user: { id: user.id } },
      });
      if (isDouble) throw new OfferIsDoubleException();

      // ####################

      const { price, raised } = wish;
      if (newOffer.amount > price - raised) {
        newOffer.amount = price - raised;
      }
      const offer = await queryRunner.manager.create(OfferEntity, {
        ...newOffer,
        user,
        item: { id: itemId },
      });
      await queryRunner.manager.save(OfferEntity, offer);

      // ####################

      wish.raised += newOffer.amount;
      await queryRunner.manager.save(WishEntity, wish);

      // ####################

      await queryRunner.commitTransaction();
      return offer;

      // ####################
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  // ======================================

  async find(query: FindManyOptions): Promise<OfferEntity[]> {
    const offers = await this.offerRepository.find(query);
    this.isExist(offers);
    return offers;
  }

  // ======================================

  async findWishOffers(query: FindOneOptions): Promise<OfferEntity[]> {
    const offer = await this.offerRepository.findOne(query);
    this.isExist(offer);
    return offer.item.offers;
  }

  // ======================================

  private isExist(offer: OfferEntity | OfferEntity[] | null): void {
    if (!offer) throw new OfferIsNotExistException();
    if (isArray(offer) && (offer as OfferEntity[]).length === 0)
      throw new OfferIsNotExistException();
  }
}
