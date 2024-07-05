import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OfferEntity, UserEntity } from '../entities.index';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto';
import { OfferIsDoubleException, OfferIsNotExistException } from './exceptions';
import { isArray } from 'class-validator';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(OfferEntity)
    private offerRepository: Repository<OfferEntity>,
  ) {}

  // ======================================

  async create(
    user: UserEntity,
    createOfferDto: CreateOfferDto,
  ): Promise<OfferEntity> {
    const { itemId, ...newOffer } = createOfferDto; //eslint-disable-line

    const isDouble = this.offerRepository.findOne({
      where: { item: { id: itemId }, user: { id: user.id } },
    });

    if (isDouble) throw new OfferIsDoubleException();

    const offer = this.offerRepository.create({
      ...newOffer,
      user,
      item: { id: itemId },
    });

    return await this.offerRepository.save(offer);
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
