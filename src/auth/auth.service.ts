import {
    HttpException, HttpStatus,
    Injectable,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Response} from "express";
import Config from "../config";
import {SignInDto} from './Dto/signIn.dto';
import {UsersService} from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService, private usersService:UsersService) {
    }

    async signIn({email, password}: SignInDto){
        console.log({email, password});
        const userId = await this.usersService.getUserIdByCredentials({email, password});
        if (!userId) {
            throw new HttpException('Не верный логин или пароль', HttpStatus.UNAUTHORIZED);
        }
        return this.getTokenObj({userId})
    }

    async signUp({email, password}: SignInDto){
        const user = await this.usersService.createUser({email, password});
        const userId = user['_id'];
        if (!userId) {
            throw new HttpException('104 - Ошибка на сервере (Не удалось зарегистрировать пользователя)', HttpStatus.BAD_REQUEST);
        }
        return this.getTokenObj({userId})
    }

    async checkDecodeToken(token: string): Promise<string> {

        const result = await this.jwtService.decode(token)

        if (!result) {
            throw new HttpException('100 - Ошибка на сервере (неверный формат токена)', HttpStatus.BAD_REQUEST);
        }
        if (!result['userId']) {
            throw new HttpException('101 - Ошибка на сервере (неверный формат токена)', HttpStatus.BAD_REQUEST);
        }
        if ((result['exp'] * 1000 - Date.now()) < 0) {
            throw new HttpException('need to refresh token', HttpStatus.FORBIDDEN);
        }
        return result['userId'];
    }

    async refreshToken(refresh_token: string) {
        const userId = await this.checkDecodeToken(refresh_token);
        return this.getTokenObj({userId});
    }

    getTokenObj(payload){
        return {
            'access_token': this.jwtService.sign(payload, {expiresIn: Config.tokenTimeout}),
            'refresh_token': this.jwtService.sign(payload, {expiresIn: Config.refreshTokenTimeout})
        }
    }
}
