import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  UsersModule,
  WishesModule,
  // WishlistsModule,
  // OffersModule,
  AuthModule,
} from './modules/modules.index';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigFactory } from './config/db-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DbConfigFactory,
    }),
    UsersModule,
    WishesModule,
    // WishlistsModule,
    // OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
