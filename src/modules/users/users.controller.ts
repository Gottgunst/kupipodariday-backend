import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  UseFilters,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserId } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EntityNotFoundFilter } from 'src/common/filters';
import { UsersService } from '../services.index';
import {
  FindUsersDto,
  UpdateUserDto,
  UserProfileResponseDto,
  UserPublicProfileResponseDto,
} from './dto';
import { UserEntity, WishEntity } from '../entities.index';
import { RemovePasswordInterceptor } from './interceptors';
import { UserId } from 'src/common/types';

// #####################################
// ############ PUBLIC #################
// #####################################

@ApiTags('Users')
@UseFilters(EntityNotFoundFilter)
@Controller('users')
export class UsersPublicController {
  constructor(private usersService: UsersService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Публичные данные пользователя',
    type: UserPublicProfileResponseDto,
  })
  @Get(':username')
  findByName(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = this.usersService.findOne({ where: { username } });
    if (user) return user;
    throw new NotFoundException(`Пользователя нет`);
  }
}

// #####################################
// ########### PRIVATE #################
// #####################################

@ApiTags('Users')
@UseInterceptors(RemovePasswordInterceptor)
@UseFilters(EntityNotFoundFilter)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Получаем данные текущего пользователя на основе токена',
    type: UserProfileResponseDto,
  })
  @Get('me')
  findSelf(@AuthUser() user: UserEntity): Promise<UserProfileResponseDto> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ======================================

  @ApiOkResponse({
    description: 'Правим данные текущего пользователя',
    type: UpdateUserDto,
  })
  @Patch('me')
  async updateSelf(
    @AuthUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = user;
    return this.usersService.updateOne(id, updateUserDto);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Массив желаний текущего пользователя',
    type: [WishEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async findMyWishes(@AuthUserId() userId: UserId): Promise<WishEntity[]> {
    return await this.usersService.findWishes('user.id = :userId', { userId });
  }

  // ======================================

  @ApiOkResponse({
    description: 'Массив желаний указанного пользователя',
    type: [WishEntity],
  })
  @Get(':username/wishes')
  async findWishesById(
    @Param('username') username: string,
  ): Promise<WishEntity[]> {
    return await this.usersService.findWishes('user.username = :username', {
      username,
    });
  }

  // ======================================

  // @Post('find')
  // find(@Body() { query }: FindUsersDto) {
  //   return this.usersService.findByEmailOrUsername(query);
  // }
}
