import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsNumber, Min } from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { WishEntity } from 'src/modules/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OfferEntity {
  @ApiProperty({
    description: 'Идентификатор складчины',
    example: 321,
  })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  // ======================================

  @ApiProperty({
    description: 'Дата создания складчины',
    example: '25.02.2022',
  })
  @IsEmpty()
  @CreateDateColumn()
  createdAt: Date;

  // ======================================

  @ApiProperty({
    description: 'Дата изменения складчины',
    example: '27.04.2024',
  })
  @IsEmpty()
  @CreateDateColumn()
  updatedA: Date;

  // ======================================

  @ApiProperty({
    description: 'Количество людей в складчине',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Column({
    type: 'int',
    default: 1,
  })
  amount: number;

  // ======================================

  @ApiProperty({
    description: 'Открыта ли складчина',
    example: false,
  })
  @IsBoolean()
  @Column({
    default: false,
  })
  hidden: boolean;

  // ======================================

  @ManyToOne(() => UserEntity, (user) => user.offers)
  user: UserEntity;

  // ======================================

  @ManyToOne(() => WishEntity, (wish) => wish.offers)
  item: WishEntity;
}
