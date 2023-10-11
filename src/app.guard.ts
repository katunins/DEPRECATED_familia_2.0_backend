import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { Reflector } from '@nestjs/core';
import { IRoleTypes } from './types';
import { tokenExtractor } from './helper';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  /**
   * Проверяет параметры в headers
   * Проверяет автризацию
   * Проверяет дополнительные метки, закодированные в токен
   * Обновляет время последнего визита
   * @param context
   */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const roleType = this.reflector.get<IRoleTypes>(
      'roleType',
      context.getHandler(),
    );
    if (roleType === 'guest') return true;
    await this.authService.checkDecodeToken(
      tokenExtractor(request.headers['authorization']),
    );
    return true;
  }
}
