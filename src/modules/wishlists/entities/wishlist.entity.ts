import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { UserPublicProfileResponseDto } from 'src/modules/users/dto/public-response-user.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { WishPartial } from 'src/modules/wishes/dto/response-wish.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WishlistEntity {
  @ApiProperty({
    description: 'Идентификатор списка желаний',
    example: 11,
  })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  // ======================================

  @ApiProperty({
    description: 'Дата создания списка желаний',
    example: '25.02.2022',
  })
  @IsEmpty()
  @CreateDateColumn()
  createdAt: Date;

  // ======================================

  @ApiProperty({
    description: 'Дата изменения данных списка желаний',
    example: '27.04.2024',
  })
  @IsEmpty()
  @CreateDateColumn()
  updatedA: Date;

  // ======================================

  @ApiProperty({
    description: 'Название списка желаний',
    example: 'Хотелки',
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
    description: 'Изображение для списка желаний',
    example: 'https://i.pravatar.cc/150?img=3',
  })
  @IsOptional()
  @IsUrl()
  @Column({
    default: 'https://i.pravatar.cc/150?img=3',
    type: 'text',
  })
  image: string;

  // ======================================

  @ApiPropertyOptional({
    description: 'Описание списка желаний',
    example: 'На день рождения',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1500)
  @Column({
    type: 'varchar',
    length: 1500,
  })
  description: string;

  // ======================================

  @ApiProperty({
    description: 'Создатель списка желаний',
    type: () => UserPublicProfileResponseDto,
    default: [],
  })
  @ManyToOne(() => UserEntity, (user) => user.wishlists)
  @JoinColumn()
  owner: UserPublicProfileResponseDto;

  // ======================================

  @ApiProperty({
    isArray: true,
    type: () => [WishPartial],
    description: 'Список желаний',
  })
  @IsArray()
  @Column({
    type: 'simple-array',
    default: [],
  })
  items: WishPartial[];

  // ======================================
}
