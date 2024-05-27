import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  // ################################
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 123,
  })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  // ################################

  @ApiProperty({
    description: 'Username пользователя',
    example: 'Wisher',
  })
  @IsString()
  @Column({
    unique: true,
  })
  @Length(1, 64)
  username: string | null;

  // ################################

  @ApiPropertyOptional({
    description: 'Описание пользователя',
    example: 'Лихой ковбой',
  })
  @IsString()
  @IsOptional()
  @Column({
    default: 'Описание пользователя',
  })
  @Length(1, 200)
  about: string;

  // ################################

  @ApiPropertyOptional({
    description: 'Аватар пользователя',
    example: 'https://i.pravatar.cc/150?img=3',
  })
  @IsUrl()
  @IsOptional()
  @Column({
    default: 'https://i.pravatar.cc/150?img=3',
  })
  avatar: string;

  // ################################

  @ApiProperty({
    description: 'Почта пользователя',
    example: 'wisher@yandex.ru',
  })
  @IsEmail()
  @Column({
    default: 'wisher@yandex.ru',
    unique: true,
    select: false,
  })
  email: string;

  // ################################

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '22.02.2022',
  })
  @CreateDateColumn()
  createdAt: Date;

  // ################################

  @ApiProperty({
    description: 'Дата изменения данных пользователя',
    example: '24.04.2024',
  })
  @CreateDateColumn()
  updatedA: Date;

  // ################################

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'qwerty12345',
  })
  @IsString()
  @Exclude({})
  password: string;

  // ################################

  // @ApiProperty({
  //   isArray: true,
  //   type: () => WishEntity,
  //   default: [],
  //   description: 'Избранные подарки',
  // })
  // wishes: WishEntity[];

  // ################################
}
