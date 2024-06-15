import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { UserEntity, WishEntity } from '../entities.index';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserId } from 'src/common/types';

// #####################################
// #####################################
// #####################################

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  // ======================================

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user);
  }

  // ======================================

  findById(id: UserId): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // ======================================

  findOne(query: FindOneOptions<UserEntity>) {
    return this.usersRepository.findOne(query);
  }

  // ======================================

  async updateOne(id: UserId, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return await this.usersRepository.save({ ...user, ...updateUserDto });
  }

  // ======================================

  // async removeOne(query: FindOneOptions<UserEntity>) {
  //   const user = await this.usersRepository.findOne(query);
  //   return await this.usersRepository.remove(user);
  // }

  // ======================================

  async findWishes(where, param): Promise<WishEntity[]> {
    const populatedUser = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.username')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .leftJoinAndSelect(
        'wishes.offers',
        'offers',
        'offers.hidden = :isHidden',
        { isHidden: false },
      )
      .where(where, param)
      .getOne();

    if (!populatedUser) throw new NotFoundException();

    return populatedUser.wishes;
  }
}
