import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { UserEntity, WishEntity } from '../entities.index';
import { CreateUserDto, SignUpUserResponseDto, UpdateUserDto } from './dto';
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

  async create(createUserDto: CreateUserDto): Promise<SignUpUserResponseDto> {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user);
  }

  // ======================================

  findById(id: UserId): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  // ======================================

  findOne(query: FindOneOptions<UserEntity>) {
    return this.usersRepository.findOne(query);
  }

  // ======================================

  findMany(query: FindManyOptions<UserEntity>) {
    return this.usersRepository.find(query);
  }

  // ======================================

  async updateOne(
    id: UserId,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    console.log(user);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  // ======================================

  // async removeOne(query: FindOneOptions<UserEntity>) {
  //   const user = await this.usersRepository.findOne(query);
  //   return await this.usersRepository.remove(user);
  // }

  // ======================================

  async findWishes(property, value): Promise<WishEntity[]> {
    const populatedUser = await this.usersRepository.findOne({
      where: { [property]: value },
      select: ['wishes'],
      relations: { wishes: { offers: true } },
    });

    return populatedUser.wishes;
  }
}
