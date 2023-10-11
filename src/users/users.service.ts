import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../auth/Dto/signIn.dto';
import Config from '../config';
import { getReqUserId, tokenExtractor } from 'src/helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getUserIdByCredentials({
    email,
    password,
  }: SignInDto): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return null;
    }
    return user['_id'];
  }

  async createUser({ email, password }: SignInDto): Promise<User> {
    const sameUser = await this.userModel.findOne({ email });
    if (sameUser) {
      throw new HttpException(
        '106 - Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = await bcrypt.hash(password, Config.bcryptSaltRounds);
    const user = new this.userModel({
      email,
      password: hash,
    });
    return await user.save();
  }

  async getUser(@Req() req: Request): Promise<User> {
    const userId = getReqUserId(req);
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException(
        '108 - Ошибка на сервере (Не найден пользователь)',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async updateUser(data, @Req() req: Request): Promise<User> {
    const userId = getReqUserId(req);
    return await this.userModel.findByIdAndUpdate(userId, data, { new: true });
  }
}
