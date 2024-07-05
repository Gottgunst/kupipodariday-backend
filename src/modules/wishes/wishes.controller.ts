import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AuthPublicUser,
  AuthUser,
  AuthUserId,
} from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { CreateWishDto, UpdateWishDto } from './dto';
import { WishEntity } from '../entities.index';
import { FilterWishOffersInterceptor } from './interceptions';
import { UserId, WishId } from 'src/common/types';
import { UserPublicProfileResponseDto } from '../users/dto';

// #####################################
// ############ PUBLIC #################
// #####################################

@ApiTags('Wishes')
@UseInterceptors(FilterWishOffersInterceptor)
@Controller('wishes')
export class WishesPublicController {
  constructor(private wishesService: WishesService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Последние 40 подарков',
    type: [WishEntity],
  })
  @Get('last')
  lastWishes(): Promise<WishEntity[]> {
    return this.wishesService.findLast();
  }

  // ======================================

  @ApiOkResponse({
    description: '20 Популярных подарков',
    type: [WishEntity],
  })
  @Get('top')
  topWishes(): Promise<WishEntity[]> {
    return this.wishesService.findPopular();
  }
}

// #####################################
// ########### PRIVATE #################
// #####################################

@ApiTags('Wishes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FilterWishOffersInterceptor)
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Создаём новый подарок',
    type: WishEntity,
  })
  @Post()
  create(
    @AuthPublicUser() user: UserPublicProfileResponseDto,
    @Body() createWishDto: CreateWishDto,
  ): Promise<WishEntity> {
    return this.wishesService.create(createWishDto, user);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Получаем данные о подарке по id',
    type: WishEntity,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  // ======================================

  @ApiOkResponse({
    description: 'Изменение данных о подарке по id',
    type: UpdateWishDto,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @AuthUserId() userId: UserId,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(
      {
        where: { id },
        relations: ['owner', 'offers'],
      },
      userId,
      updateWishDto,
    );
  }

  // ======================================

  @ApiOkResponse({
    description: 'Удаление подарка по id',
    type: WishEntity,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @AuthUserId() userId: UserId) {
    return this.wishesService.deleteOne(
      {
        where: { id },
        relations: ['owner'],
        select: ['id', 'name', 'link', 'image', 'price', 'description'],
      },
      userId,
    );
  }

  // ======================================

  @ApiOkResponse({
    description: 'Копирование подарка по id',
    type: WishEntity,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Post(':id/copy')
  copy(@AuthUser() user, @Param('id', ParseIntPipe) wishId: WishId) {
    return this.wishesService.copyOne(
      {
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
      },
      user,
    );
  }
}
