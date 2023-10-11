import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { extname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import { Model } from 'mongoose';
import { IPaginationRequest, IPaginationResponse, ISearchData } from './types';
import Config from './config';

/**
 * Выделяет токен из заголовка  Bearer _____
 * @param authorization
 */
export const tokenExtractor = (authorization: string): string => {
  if (!authorization) throw new UnauthorizedException();
  const tokenArr = authorization.split(' ');
  if (!tokenArr || tokenArr.length !== 2)
    throw new HttpException(
      '105 - Не верный формат токена авторизации',
      HttpStatus.BAD_REQUEST,
    );
  return tokenArr[1];
};

/**
 * пытается получить userId из токена
 * @param req
 */
export const getReqUserId = (req: Request): string => {
  const accessToken = tokenExtractor(req.headers['authorization']);
  const result = new JwtService().decode(accessToken);
  if (!result) {
    throw new HttpException(
      '106 - Не верный формат токена авторизации',
      HttpStatus.BAD_REQUEST,
    );
  }
  const userId = result['userId'];
  if (!userId) {
    throw new HttpException(
      '107 - Ошибка на сервере (неверный формат токена)',
      HttpStatus.BAD_REQUEST,
    );
  }
  return userId;
};

export const generateFilename = (file) => {
  const ext = extname(file.originalname);
  const name = file.originalname.split(ext)[0];
  return `${name}__${Date.now()}${ext}`;
};

export const createPath = (pathString) => {
  if (existsSync(pathString)) return;
  let path = '';
  pathString.split('/').forEach((item) => {
    path += item + '/';
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  });
  return path;
};

export const removeFilesBackground = (filesToDelete: string[]) => {
  if (!filesToDelete) return;
  filesToDelete.map((item) => {
    if (item === '') return;
    const pathToDelete = path.resolve(item);
    const pathToDeleteHD =
      path.dirname(pathToDelete) + '/HD/' + path.basename(pathToDelete);
    if (existsSync(pathToDelete)) {
      unlinkSync(pathToDelete);
    }
    if (existsSync(pathToDeleteHD)) {
      unlinkSync(pathToDeleteHD);
    }
  });
};

interface IGetDataModelWithPagination {
  model: Model<any>;
  pagination: IPaginationRequest;
  searchData?: ISearchData;
  baseFilters?: object[];
}

/**
 * Метод делает поиск в модели, учитывая пагинацию и поиск
 * @param model - модель
 * @param pagination - аобъект пейджинга
 * @param searchData - объект поиска (строка поиска и поля)
 * @param searchArr - массив дополнительных фильтров
 *
 * возвращает
 * page - номер страницы
 * pageSize - кол-во записей на странице
 * total - кол-во записей всего, найденных по базовому фильтру с поиском
 * totalAll - кол-во записей всего в базе, найденных только по базовому фильтру
 */
export const getDataModelWithPagination = async <T>(
  params: IGetDataModelWithPagination,
): Promise<{ data: T[]; pagination: IPaginationResponse }> => {
  const { model, pagination, searchData, baseFilters } = params;
  const { page, pageSize } = parsePaginationRequest(pagination);

  const searchArr = [...baseFilters];

  if (searchData) {
    searchArr.push({
      $or: searchData.fields.map((item) => ({
        [item]: { $regex: '.*' + searchData.search + '.*', $options: 'i' },
      })),
    });
  }

  const result = await model.find({
    $and: searchArr,
  });

  const totalAll = await model.countDocuments({ $and: baseFilters });

  return {
    data: result.slice(page * pageSize, page * pageSize + pageSize),
    pagination: {
      page,
      pageSize,
      total: result.length,
      totalAll,
    },
  };
};

export const parsePaginationRequest = (
  paginationRequest: IPaginationRequest,
) => ({
  page: parseInt(paginationRequest.page),
  pageSize: parseInt(paginationRequest.pageSize),
});

export const getBasePath = (req, postfix?) => {
  const { pathType } = req.body;
  let basePath = `${Config.storageFolder}/${getReqUserId(req)}`;

  if (pathType) {
    basePath += `/${pathType}`;
  }

  if (postfix) {
    basePath += `/${postfix}`;
  }

  return basePath;
};
