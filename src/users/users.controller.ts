import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  Headers,
  Req,
  Res,
  Put,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { tokenExtractor } from 'src/helper';
import { RoleType } from 'src/decorators';
import { IUpdateUserData } from 'src/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RoleType('user')
  getUser(@Req() req: Request) {
    return this.usersService.getUser(req);
  }

  @Post()
  @RoleType('user')
  updateUser(
    @Body() body: IUpdateUserData,
    @Req() req: Request,
  ): Promise<User> {
    return this.usersService.updateUser(body, req);
  }
}
