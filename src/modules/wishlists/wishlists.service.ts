import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishEntity, WishlistEntity } from '../entities.index';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto, UpdateWishlistDto } from './dto';
import { UserPublicProfileResponseDto } from '../users/dto';
import {
  UserIsNotWishlistOwnerException,
  WishlistIsNotExistException,
} from './exceptions';
import { UserId } from 'src/common/types';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishlistEntity)
    private wishlistsRepository: Repository<WishlistEntity>,
    @InjectRepository(WishEntity)
    private wishesRepository: Repository<WishEntity>,
  ) {}

  // ======================================

  async create(
    user: UserPublicProfileResponseDto,
    createWishlistDto: CreateWishlistDto,
  ): Promise<WishlistEntity> {
    const { itemsId, ...newWishlist } = createWishlistDto;

    const itemsArray = await this.wishesRepository.find({
      where: { id: In(itemsId) },
    });

    const wishlist = this.wishlistsRepository.create({
      ...newWishlist,
      items: itemsArray,
      owner: user,
    });

    return this.wishlistsRepository.save(wishlist);
  }

  // ======================================

  findAll(): Promise<WishlistEntity[]> {
    return this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  // ======================================

  async findOne(id: number): Promise<WishlistEntity> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    this.isExist(wishlist);

    return wishlist;
  }

  // ======================================

  async updateOne(
    id: number,
    userId: UserId,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishlistEntity> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    this.isExist(wishlist);
    this.isOwner(userId, wishlist.owner.id);

    const { itemsId, ...updateWishlist } = updateWishlistDto;

    const itemsArray = await this.wishesRepository.find({
      where: { id: In(itemsId) },
    });

    updateWishlist['id'] = id;
    updateWishlist['items'] = itemsArray;

    return this.wishlistsRepository.save(updateWishlist);
  }

  // ======================================

  async removeOne(id: number, userId: number): Promise<WishlistEntity> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    this.isExist(wishlist);
    this.isOwner(userId, wishlist.owner.id);

    await this.wishlistsRepository.remove(wishlist);

    return wishlist;
  }
  // ======================================

  private isExist(wishlist: WishlistEntity | null): void {
    if (!wishlist) throw new WishlistIsNotExistException();
  }

  private isOwner(wishlistOwnerId: UserId, userId: UserId): void {
    if (wishlistOwnerId !== userId) throw new UserIsNotWishlistOwnerException();
  }
}
