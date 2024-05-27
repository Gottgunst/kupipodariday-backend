import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  // constructor(private readonly ) {}
  // ################################
  // @ApiOkResponse({
  //   description: 'Подучаем данные текущего пользователя на основе токена',
  //   type: OmitType(UserEntity, ['password','email'])
  // })
  // @Get('me')
  // findOwn(@Req() req): Promise<any> {
  // }
  // ################################
  // @Patch('me')
  // ################################
  // @Get('me/wishes')
  // ################################
  // @Get(':id')
  //   findById(@Param('id') id: string) {
  //       const user = this.residents.find((r)=> r.id===id);
  //       if(user)
  //        return user;
  //       throw new NotFoundException(`пользователя нет`);
  // ################################
  // @Get(':id/wishes')
  // ################################
  // @Post('find')
}
