import {
  Body,
  Controller, HttpCode, HttpStatus, UseFilters, Post, Delete, Get, Query, Req, Patch,
} from '@nestjs/common';
import { NoteDto } from './dto/note.dto';
import { Note } from './schemas/note.schema';
import { NotesService } from './notes.service';
import { IPaginationRequest, INotesQuery, IRelativesNotesQuery } from 'src/types';
import { RoleType } from 'src/decorators';

export interface INoteUpdateData {
  id: string;
  noteData: NoteDto;
}

@Controller('notes')
export class NotesController {

  constructor(private readonly notesService: NotesService) {
  }

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
  getRelativeNotesCount(@Req() req: Request, @Query() query: {relativeId: string}) {
    return this.notesService.getRelativeNotesCount(req, query.relativeId);
  }


  // @Post()
  //
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() noteDto: NoteDto): Promise<Note> {
  //   return this.notesService.create(noteDto);
  // }
  //
  // @Patch()
  //
  // @HttpCode(HttpStatus.CREATED)
  // update(@Body() data: INoteUpdateData): Promise<Note> {
  //   return this.notesService.update(data);
  // }
  //
  // @Delete()
  //
  // @HttpCode(HttpStatus.OK)
  // delete(@Body() data: INoteUpdateData) {
  //   return this.notesService.delete(data);
  // }
}
