import {Body, Controller, Post, Get, Res, Param, Query, Req, HttpException, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from './auth.service';
import {RefreshDto} from './Dto/refresh.dto';
import {RoleType} from '../decorators';
import {SignInDto} from './Dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get()
  @RoleType('guest')
  async signIn(@Query() query: SignInDto, @Req() req: Request) {
    return await this.authService.signIn(query);
  }

  @Post()
  @RoleType('guest')
  async signUp(@Body() body: SignInDto, @Req() req: Request) {
    return await this.authService.signUp(body);
  }

  /**
   * Обновление токена
   */
  @Get('refresh')
  @RoleType('guest')
  async refreshToken(@Query() {refresh_token}: RefreshDto) {
    return await this.authService.refreshToken(refresh_token);
  }
}
