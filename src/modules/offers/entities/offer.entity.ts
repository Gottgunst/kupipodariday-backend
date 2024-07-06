import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsNumber, Min } from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { WishEntity } from 'src/modules/wishes/entities/wish.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OfferEntity {
  @ApiProperty({
    description: 'Идентификатор вклада',
    example: 321,
  })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  // ======================================

  @ApiProperty({
    description: 'Дата создания вклада',
    example: '25.02.2022',
  })
  @IsEmpty()
  @CreateDateColumn()
  createdAt: Date;

  // ======================================

  @ApiProperty({
    description: 'Дата изменения вклада',
    example: '27.04.2024',
  })
  @IsEmpty()
  @CreateDateColumn()
  updatedA: Date;

  // ======================================

  @ApiProperty({
    description: 'Количество средств во вкладе',
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
    description: 'Явное или тайное участие во вкладе',
    example: false,
  })
  @IsBoolean()
  @Column({
    default: false,
  })
  hidden: boolean;

  // ======================================

  @ApiProperty({
    type: UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.offers)
  user: UserEntity;

  // ======================================

  @BeforeInsert()
  setCreatorName() {
    this.name = this.user.username;
  }

  @BeforeUpdate()
  setCreatorNameOnUpdate() {
    if (!this.name && this.user) {
      this.name = this.user.username;
    }
  }

  @ApiProperty({
    description: 'Имя мецената, автоматически соответствует создателю вклада',
    type: UserEntity['username'],
  })
  @Column({ nullable: true })
  name: string;

  // ======================================

  @ApiProperty({
    type: WishEntity,
  })
  @ManyToOne(() => WishEntity, (wish) => wish.offers)
  item: WishEntity;

  // ======================================
}
