import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import Config from 'src/config';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    JwtModule.register({ secret: Config.jwtSecret }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule],
})
export class UsersModule {}
