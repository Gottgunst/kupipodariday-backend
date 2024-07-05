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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { WishlistEntity } from './entities/wishlist.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { AuthPublicUser, AuthUserId } from 'src/common/decorators';
import { CreateWishlistDto, UpdateWishlistDto } from './dto';
import { UserId } from 'src/common/types';
import { UserPublicProfileResponseDto } from '../users/dto';

@ApiTags('Wishlistlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Списки желаний пользователей',
    type: [WishlistEntity],
  })
  @Get()
  findAll(): Promise<WishlistEntity[]> {
    return this.wishlistsService.findAll();
  }

  // ======================================

  @ApiOkResponse({
    description: 'Создать список желаний',
    type: WishlistEntity,
  })
  @Post()
  create(
    @AuthPublicUser() user: UserPublicProfileResponseDto,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishlistEntity> {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Получить список желаний по id',
    type: WishlistEntity,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<WishlistEntity> {
    return this.wishlistsService.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  // ======================================

  @ApiOkResponse({
    description: 'Изменить список желаний по id',
    type: WishlistEntity,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUserId() userId: UserId,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishlistEntity> {
    return this.wishlistsService.updateOne(
      {
        where: { id },
        relations: ['owner'],
      },
      userId,
      updateWishlistDto,
    );
  }

  // ======================================

  @ApiOkResponse({
    description: 'Удалить список желаний по id',
    type: WishlistEntity,
  })
  @ApiParam({ name: 'id', example: '1' })
  @Delete(':id')
  removeOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUserId() userId: UserId,
  ): Promise<WishlistEntity> {
    return this.wishlistsService.removeOne(
      {
        where: { id },
        relations: ['owner'],
      },
      userId,
    );
  }

  // ======================================
}
