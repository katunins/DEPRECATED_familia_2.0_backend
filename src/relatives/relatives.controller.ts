import {
  Body,
  Controller, HttpCode, HttpStatus, Post, UseFilters, Headers, Req, Res, Put, Patch, Param, Get, Query, Delete,
} from '@nestjs/common';
import {tokenExtractor} from 'src/helper';
import {RoleType} from 'src/decorators';
import {RelativesService} from './relatives.service';
import {IPaginationRequest} from 'src/types';
import {Relative} from './schemas/relative.schema';
import {UpdateRelativeDto} from './dto/updateRelative.dto'
import {newRelativeDto} from './dto/newRelative.dto';

@Controller('relatives')
export class RelativesController {

  constructor(private readonly relativesService: RelativesService) {
  }

  @Get()
  @RoleType('user')
  getRelatives(@Req() req: Request) {
    return this.relativesService.getRelatives(req)
  }

  // ПАГИНАЦИЯ
  // @Get()
  // @RoleType('user')
  // getRelatives(@Req() req: Request, @Query() query: IPaginationRequest) {
  //   return this.relativesService.getRelatives(req, query)
  // }

  @Post()
  @RoleType('user')
  updateRelative(@Body() body: UpdateRelativeDto, @Req() req: Request): Promise<Relative> {
    return this.relativesService.updateRelative(body, req);
  }

  @Put()
  @RoleType('user')
  createRelative(@Body() body: newRelativeDto, @Req() req: Request): Promise<Relative> {
    return this.relativesService.createRelative(body, req)
  }

  @Delete()
  @RoleType('user')
  deleteRelative(@Body() {relativeId}: { relativeId: string }, @Req() req: Request) {
    return this.relativesService.deleteRelative(relativeId, req)
  }
}
