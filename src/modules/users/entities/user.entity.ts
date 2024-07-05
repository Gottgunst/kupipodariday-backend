import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import {
  OfferEntity,
  WishEntity,
  WishlistEntity,
} from 'src/modules/entities.index';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// #####################################
// #####################################
// #####################################

@Entity()
export class UserEntity {
  // ======================================

  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 123,
  })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  // ======================================

  @ApiProperty({
    description: 'Username пользователя',
    example: 'Wisher',
  })
  @IsString()
  @Column({
    unique: true,
    type: 'varchar',
    length: 64,
  })
  @Length(1, 64)
  username: string;

  // ======================================

  @ApiPropertyOptional({
    description: 'Описание пользователя',
    example: 'Лихой ковбой',
  })
  @IsString()
  @IsOptional()
  @Column({
    default: 'Описание пользователя',
    type: 'varchar',
    length: 200,
  })
  @Length(1, 200)
  about: string;

  // ======================================

  @ApiPropertyOptional({
    description: 'Аватар пользователя',
    example: 'https://i.pravatar.cc/150?img=3',
  })
  @IsUrl()
  @IsOptional()
  @Column({
    default: 'https://i.pravatar.cc/150?img=3',
    type: 'text',
  })
  avatar: string;

  // ======================================

  @ApiProperty({
    description: 'Почта пользователя',
    example: 'wisher@yandex.ru',
  })
  @IsEmail()
  @Column({
    default: 'wisher@yandex.ru',
    unique: true,
    type: 'text',
    select: false,
  })
  email: string;

  // ======================================

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '22.02.2022',
  })
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  // ======================================

  @ApiProperty({
    description: 'Дата изменения данных пользователя',
    example: '24.04.2024',
  })
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  // ======================================

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'q1w2e3r4t5y',
  })
  @IsString()
  @Column({ select: false, type: 'text' })
  password: string;

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => [WishEntity],
    default: [],
    description: 'Подарки',
  })
  @OneToMany(() => WishEntity, (wish) => wish.owner)
  wishes: WishEntity[];

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => [OfferEntity],
    default: [],
    description: 'Складчина',
  })
  @OneToMany(() => OfferEntity, (offer) => offer.user)
  offers: OfferEntity[];

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => [WishlistEntity],
    default: [],
    description: 'Списки желаний',
  })
  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.owner)
  wishlists: WishlistEntity[];

  // ======================================
}
