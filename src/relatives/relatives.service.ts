import {HttpException, HttpStatus, Injectable, Req} from '@nestjs/common';
import {Relative, RelativeDocument} from './schemas/relative.schema';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {RelativesIdsDto} from './dto/relativesIds.dto';
import {UpdateRelativeDto} from './dto/updateRelative.dto'
import {getDataModelWithPagination, getReqUserId, removeFilesBackground} from 'src/helper';
import Config from 'src/config';
import {IPaginationRequest, IPaginationResponse} from 'src/types';
import {newRelativeDto} from './dto/newRelative.dto';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class RelativesService {
  constructor(@InjectModel(Relative.name) private RelativeModel: Model<RelativeDocument>, private usersService: UsersService) {
  }

  async createRelative({
                         parents = {mother: '', father: ''},
                         data
                       }: newRelativeDto, @Req() req: Request): Promise<Relative> {
    const userId = getReqUserId(req);

    const relativeData = {
      parents: parents,
      about: '',
      access: {
        creatorId: userId,
        shareId: []
      },
      ...data,
    };
    const relative = new this.RelativeModel(relativeData).save();
    return relative;
  }

  async getRelatives(req: Request): Promise<Relative[]> {
    const userId = getReqUserId(req);
    return await this.RelativeModel.find({'access.creatorId': userId});
  }

  /**
   * Проверяет можно ли удалить родственника
   * @param relativeId
   * @param req
   */
  async checkRelativeCanDelete(relativeId: string, req: Request) {
    const userId = getReqUserId(req);
    const unitRelatives = await this.RelativeModel.countDocuments({
      $and: [
        {'access.creatorId': userId},
        {
          $or: [
            {'parents.mother': relativeId},
            {'parents.father': relativeId}
          ]
        }
      ]
    });

    if (unitRelatives > 0) {
      throw new HttpException('113 - Родственник не может быть удален, так какприкреплен к другим родственникам в качестве родителя', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.getUser(req);
    if (user.parents.father == relativeId || user.parents.mother == relativeId){
      throw new HttpException('114 - Родственник не может быть удален, так указан в качестве родителя пользователя', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteRelative(relativeId: string, @Req() req: Request) {
    const userId = getReqUserId(req);
    const relative = await this.RelativeModel.findById(relativeId);
    if (!relative) {
      throw new HttpException('111 - Ошибка на сервере (Не удалось найти родтсвенника в базе)', HttpStatus.BAD_REQUEST);
    }
    if (relative.access.creatorId !== userId) {
      throw new HttpException('112 - У данного пользователя нет прав на удаление данного родственника', HttpStatus.BAD_REQUEST);
    }

    await this.checkRelativeCanDelete(relativeId, req);

    if (relative.userPic) {
      removeFilesBackground([relative.userPic]);
    }
    await relative.delete()
  }

  async updateRelative({data, relativeId}: UpdateRelativeDto, @Req() req: Request): Promise<Relative> {
    const userId = getReqUserId(req);
    const relative = await this.RelativeModel.findById(relativeId);
    if (!relative) {
      throw new HttpException('109 - Ошибка на сервере (Не удалось найти родтсвенника в базе)', HttpStatus.BAD_REQUEST);
    }
    if (relative.access.creatorId !== userId) {
      throw new HttpException('110 - У данного пользователя нет прав на редактирование данных данного родственника', HttpStatus.BAD_REQUEST);
    }
    return await this.RelativeModel.findByIdAndUpdate(relativeId, data, {new: true});
  }
}

