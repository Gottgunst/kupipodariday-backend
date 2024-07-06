import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  decimalTransformer,
  roundFloatTransformer,
} from 'src/helpers/entity.transformers';
import { UserPublicProfileResponseDto } from 'src/modules/users/dto';
import {
  UserEntity,
  OfferEntity,
  WishlistEntity,
} from 'src/modules/entities.index';
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

// #####################################
// #####################################
// #####################################

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
  @Max(99999999.99)
  @Transform(roundFloatTransformer)
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    transformer: decimalTransformer,
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
  @Max(99999999.99)
  @Transform(roundFloatTransformer)
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
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

  @ApiProperty({
    description:
      'Идентификатор подарка с которого делали копию, если подарок уникальный, то  значение равно 0',
    example: 0,
  })
  @IsNumber()
  @Min(0)
  @Column({
    type: 'int',
    default: 0,
    select: false,
  })
  parentId: number;

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
    type: UserPublicProfileResponseDto,
  })
  @ManyToOne(() => UserEntity, (user) => user.wishes)
  @JoinColumn()
  owner: UserPublicProfileResponseDto;

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => OfferEntity,
  })
  @OneToMany(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => WishlistEntity,
  })
  @ManyToMany(() => WishlistEntity, (wishlist) => wishlist.items)
  wishlists: WishlistEntity[];
}
