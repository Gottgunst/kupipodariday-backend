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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserId } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EntityNotFoundFilter } from 'src/common/filters';
import { UsersService } from '../services.index';
import {
  FindUsersDto,
  UpdateUserDto,
  UserProfileResponseDto,
  UserPublicProfileResponseDto,
} from './dto';
import { WishEntity } from '../entities.index';
import {
  RemoveEmailInterceptor,
  RemoveIdInterceptor,
  RemovePasswordInterceptor,
} from './interceptors';
import { UserId } from 'src/common/types';
import { UserWishesDto } from '../wishes/dto';

// #####################################
// #####################################
// #####################################

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(RemovePasswordInterceptor)
@UseFilters(EntityNotFoundFilter)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Получаем данные текущего пользователя на основе токена',
    type: UserProfileResponseDto,
  })
  @Get('me')
  findSelf(@AuthUserId() id: UserId): Promise<UserProfileResponseDto> {
    return this.usersService.findById(id);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Правим данные текущего пользователя',
    type: UpdateUserDto,
  })
  @UseInterceptors(RemoveIdInterceptor)
  @Patch('me')
  async updateSelf(
    @AuthUserId() id: UserId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return await this.usersService.updateOne(id, updateUserDto);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Массив желаний текущего пользователя',
    type: [WishEntity],
  })
  @Get('me/wishes')
  async findMyWishes(@AuthUserId() userId: UserId): Promise<WishEntity[]> {
    return await this.usersService.findWishes('id', userId);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Публичные данные пользователя',
    type: UserPublicProfileResponseDto,
  })
  @ApiParam({ name: 'username', example: 'Wisher' })
  @UseInterceptors(RemoveEmailInterceptor)
  @Get(':username')
  findByName(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = this.usersService.findOne({ where: { username } });
    if (user) return user;
    throw new NotFoundException(`Пользователя нет`);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Массив желаний указанного пользователя',
    type: [UserWishesDto],
  })
  @ApiParam({ name: 'username', example: 'Wisher' })
  @Get(':username/wishes')
  async findWishesById(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    return await this.usersService.findWishes('username', username);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Поиск по почте или имени пользователя',
    type: [UserProfileResponseDto],
  })
  @Post('find')
  find(@Body() { query }: FindUsersDto): Promise<UserProfileResponseDto[]> {
    return this.usersService.findMany({
      where: [{ email: query }, { username: query }],
    });
  }
}
