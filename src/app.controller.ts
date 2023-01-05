import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleType } from './decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':uploads/:id/:filename')
  @RoleType('user')
  async getFile(@Param() param, @Req() req: any, @Res() res: any) {
    res.sendFile(param.filename, { root: `${param.uploads}/${param.id}` });
  }

  @Get(':uploads/:id/:type/:filename')
  @RoleType('user')
  async getTypeFile(@Param() param, @Req() req: any, @Res() res: any) {
    await res.sendFile(param.filename, { root: `${param.uploads}/${param.id}/${param.type}` });
  }
}
