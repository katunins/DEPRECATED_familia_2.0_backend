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

@Injectable()
export class RelativesService {
  constructor(@InjectModel(Relative.name) private RelativeModel: Model<RelativeDocument>) {
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

  // async getRelatives(relativesIds: RelativesIdsDto): Promise<Relative[]> {
  //   const relatives = await this.RelativeModel.find({ _id: { $in: relativesIds.relativesIds } });
  //   return relatives;
  // }

  async getRelatives(req: Request): Promise<Relative[]> {
    const userId = getReqUserId(req);
    return await this.RelativeModel.find({'access.creatorId': userId});
  }

  async deleteRelative(relativeId: string, @Req() req: Request){
    const userId = getReqUserId(req);
    const relative = await this.RelativeModel.findById(relativeId);
    if (!relative) {
      throw new HttpException('111 - Ошибка на сервере (Не удалось найти родтсвенника в базе)', HttpStatus.BAD_REQUEST);
    }
    if (relative.access.creatorId !== userId) {
      throw new HttpException('112 - У данного пользователя нет прав на удаление данного родственника', HttpStatus.BAD_REQUEST);
    }
    if (relative.userPic) {
      removeFilesBackground([relative.userPic]);
    }
    await relative.delete()
  }

  // ПАГИНАЦИЯ
  // async getRelatives(req: Request, paginationRequest: IPaginationRequest): Promise<{ data: Relative[], pagination: IPaginationResponse }> {
  //   const userId = getReqUserId(req);
  //
  //   return await getDataModelWithPagination({
  //     model: this.RelativeModel,
  //     paginationRequest,
  //     filterObject: {'access.creatorId': userId}
  //   });
  // }

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

  //   const relatives = await this.RelativeModel
  //     .find({'access.creatorId': userId})
  //     .skip(page * pageSize)
  //     .limit(pageSize);
  //   return {
  //     data: relatives,
  //     pagination: {
  //       page: page,
  //       total: await this.RelativeModel.count().exec()
  //     }
  //   };
  // }

  // async updateRelative(data: IRelativeUpdateData): Promise<Relative> {
  //   const relative = await this.RelativeModel.findByIdAndUpdate(data.id, data.userData);
  //   return relative;
  // }
  //
  // async deleteRelative(data: IRelativeUpdateData) {
  //   setTimeout(() => removeFilesBackground([data.userData.userPic]), 10000);
  //   const result = await this.RelativeModel.findByIdAndDelete(data.id);
  //   return result;
  // }
}

