import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import Config from "../config";
import {UsersService} from '../users/users.service';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [
        JwtModule.register({secret: Config.jwtSecret}),
        forwardRef(() => UsersModule),
    ],
    providers: [AuthService, UsersService],
    controllers: [AuthController]
})
export class AuthModule {
}
