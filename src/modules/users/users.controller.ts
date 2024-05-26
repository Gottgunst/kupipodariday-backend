import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  // constructor(private readonly ) {}
  //
  //   @Get(':id')
  //   findById(@Param('id') id: string) {
  //       const user = this.residents.find((r)=> r.id===id);
  //       if(user)
  //        return user;
  //       throw new NotFoundException(`пользователя нет`);
}
