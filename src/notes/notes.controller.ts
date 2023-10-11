import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UseFilters,
  Post,
  Delete,
  Get,
  Query,
  Req,
  Patch,
  Put,
} from '@nestjs/common';
import { Note } from './schemas/note.schema';
import { NotesService } from './notes.service';
import {
  IPaginationRequest,
  INotesQuery,
  IRelativesNotesQuery,
  IUpdateNote,
} from 'src/types';
import { RoleType } from 'src/decorators';
import { BaseNoteDto } from './dto/baseNote.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @RoleType('user')
  get(@Req() req: Request, @Query() query: INotesQuery) {
    return this.notesService.get(req, query);
  }

  @Get('by-user')
  @RoleType('user')
  getRelativeNotes(@Req() req: Request, @Query() query: IRelativesNotesQuery) {
    return this.notesService.getRelativeNotes(req, query);
  }

  @Get('user-count')
  @RoleType('user')
  getRelativeNotesCount(
    @Req() req: Request,
    @Query() query: { relativeId: string },
  ) {
    return this.notesService.getRelativeNotesCount(req, query.relativeId);
  }

  @Put()
  @RoleType('user')
  create(@Body() data: BaseNoteDto, @Req() req: Request): Promise<Note> {
    return this.notesService.create(req, data);
  }

  @Post()
  @RoleType('user')
  update(@Body() data: IUpdateNote, @Req() req: Request): Promise<Note> {
    return this.notesService.update(req, data);
  }

  @Delete()
  @RoleType('user')
  delete(@Body() data: { id: string }, @Req() req: Request): Promise<Note> {
    return this.notesService.delete(req, data.id);
  }
}
