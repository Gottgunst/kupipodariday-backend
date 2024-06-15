import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { OfferEntity } from 'src/modules/offers/entities/offer.entity';
import { UserPublicProfileResponseDto } from 'src/modules/users/dto/public-response-user.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { WishlistEntity } from 'src/modules/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WishEntity {
  @ApiProperty({
    description: 'Идентификатор подарка',
    example: 321,
  })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  // ======================================

  @ApiProperty({
    description: 'Дата создания подарка',
    example: '25.02.2022',
  })
  @IsEmpty()
  @CreateDateColumn()
  createdAt: Date;

  // ======================================

  @ApiProperty({
    description: 'Дата изменения данных подарка',
    example: '27.04.2024',
  })
  @IsEmpty()
  @CreateDateColumn()
  updatedA: Date;

  // ======================================

  @ApiPropertyOptional({
    description: 'Название подарка',
    example: 'Гироскутор',
  })
  @IsString()
  @Length(1, 250)
  @Column({
    type: 'varchar',
    length: 250,
  })
  name: string;

  // ======================================

  @ApiPropertyOptional({
    description: 'Ссылка на подарок',
    example: 'https://i.pravatar.cc/150?img=3',
  })
  @IsUrl()
  @Column({
    default: 'https://i.pravatar.cc/150?img=3',
    type: 'text',
  })
  link: string;

  // ======================================

  @ApiPropertyOptional({
    description: 'Изображение подарка',
    example: 'https://i.pravatar.cc/150?img=3',
  })
  @IsUrl()
  @Column({
    default: 'https://i.pravatar.cc/150?img=3',
    type: 'text',
  })
  image: string;

  // ======================================

  @ApiProperty({
    description: 'Цена подарка',
    example: 99.9,
  })
  @IsNumber()
  @Min(1)
  // @Transform(floatRounderTransformer)
  @Column({
    type: 'decimal',
    precision: 2,
    scale: 2,
    // transformer: decimalEntityColumnTransformer,
  })
  price: number;

  // ======================================

  @ApiProperty({
    description:
      'Сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок',
    example: 300,
  })
  @IsNumber()
  @Min(1)
  // @Transform(floatRounderTransformer)
  @Column({
    type: 'decimal',
    precision: 2,
    scale: 2,
    default: 0,
    // transformer: decimalEntityColumnTransformer,
  })
  raised: number;

  // ======================================

  @ApiProperty({
    description: 'Копии подарка',
    example: 1,
  })
  @IsNumber()
  @Min(0)
  @Column({
    type: 'int',
    default: 0,
  })
  copied: number;

  // ======================================

  @ApiPropertyOptional({
    description: 'Описание подарка',
    example: 'Быстрый как ветер',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1024)
  @Column({
    type: 'varchar',
    length: 1024,
  })
  description: string;

  // ======================================

  @ApiProperty({
    type: () => UserPublicProfileResponseDto,
    default: [],
    description: 'Создатель желания',
  })
  @ManyToOne(() => UserEntity, (user) => user.wishes)
  @JoinColumn()
  owner: UserPublicProfileResponseDto;

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => [OfferEntity],
    default: [],
    description: 'Список складчины',
  })
  @OneToMany(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => [WishlistEntity],
    default: [],
    description: 'Списки желаний',
  })
  @ManyToMany(() => WishlistEntity, (wishlist) => wishlist.items)
  wishlists: WishlistEntity[];
}
