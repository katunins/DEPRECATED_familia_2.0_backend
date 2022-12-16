import {
  Body,
  Controller, Post, Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {FilesInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import Config from 'src/config';
import {RoleType} from 'src/decorators';
import {createPath, generateFilename, getReqUserId, removeFilesBackground, getBasePath} from 'src/helper';
import {BodyDto} from './dto/body.dto';

const sharp = require('sharp');

@Controller('storage')
@RoleType('user')
export class StorageController {

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = getBasePath(req, 'HD');
          createPath(`${path}`);
          cb(null, `${path}`);
        },
        filename: (req, file, callback) => {
          callback(null, generateFilename(file));
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 19,
      }
    }),
  )
  async uploadMultipleFiles(@Body() body: BodyDto, @Req() req: any, @UploadedFiles() files: Express.Multer.File[]) {
    const basePath = getBasePath(req);
    const response = await Promise.all(files.map(async item => {
      try {
        await sharp(item.path, {failOnError: false})
          .resize({width: 1230})
          .rotate()
          .sharpen(1)
          .jpeg({
            quality: 60,
          })
          .toFile(`${basePath}/${item.filename}`);

        return `${basePath}/${item.filename}`;
      } catch (err) {
        console.log(err);
      }
    }));
    removeFilesBackground(body.filesToDelete);
    return response;
  }
}
