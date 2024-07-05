import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OffersService } from '../services.index';
import { OfferEntity, UserEntity } from '../entities.index';
import { AuthUser, AuthUserId } from 'src/common/decorators';
import { CreateOfferDto } from './dto';
import { UserId } from 'src/common/types';
import { Not } from 'typeorm';

// #####################################
// #####################################
// #####################################

@ApiTags('Offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  // ======================================

  @ApiOkResponse({
    description: 'Спонсировать желание',
    type: OfferEntity,
  })
  @Post()
  create(
    @AuthUser() user: UserEntity,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<OfferEntity> {
    return this.offersService.create(user, createOfferDto);
  }

  // ======================================

  @ApiOkResponse({
    description: 'Список спонсируемых вами желаний',
    type: [OfferEntity],
  })
  @Get()
  find(@AuthUserId() userId: UserId): Promise<OfferEntity[]> {
    return this.offersService.find({
      where: { user: { id: userId } },
      relations: { item: { owner: true } },
    });
  }

  // ======================================

  @ApiOkResponse({
    description: 'Спонсоры желания по его id',
    type: [OfferEntity],
  })
  @ApiParam({ name: 'id', example: '1' })
  @Get(':id')
  findWishOffers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OfferEntity[]> {
    return this.offersService.findWishOffers({
      where: { item: { id, offers: { hidden: Not(true) } } },
      relations: { item: { offers: { user: true } } },
    });
  }

  // ======================================
}
