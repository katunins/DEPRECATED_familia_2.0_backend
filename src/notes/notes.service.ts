import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Note, NoteDocument} from './schemas/note.schema';
import {BaseNoteDto} from './dto/baseNote.dto';
import {getDataModelWithPagination, getReqUserId, removeFilesBackground} from 'src/helper';
import {INotesQuery, IPaginationRequest, IRelativesNotesQuery, ISearchData, IUpdateNote} from 'src/types';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private NoteModel: Model<NoteDocument>) {
  }

  async get(req: Request, {pagination, search}: INotesQuery) {
    const userId = getReqUserId(req);
    const searchData: ISearchData = {
      search,
      fields: [
        'title',
        'description'
      ]
    }
    return await getDataModelWithPagination<Note>({
      model: this.NoteModel,
      pagination,
      searchData,
      baseFilters: [{'creator': userId}]
    });
  }

  async getRelativeNotes(req: Request, {pagination, search, relativeId}: IRelativesNotesQuery) {
    const userId = getReqUserId(req);
    const searchData: ISearchData = {
      search,
      fields: [
        'title',
        'description'
      ]
    }
    return await getDataModelWithPagination<Note>({
      model: this.NoteModel,
      pagination,
      searchData,
      baseFilters: [{'creator': userId}, {relatives: [relativeId]}]
    });
  }

  async getRelativeNotesCount(req: Request, relativeId: string) {
    const userId = getReqUserId(req);
    return await this.NoteModel.countDocuments({$and: [{'creator': userId}, {relatives: [relativeId]}]});
  }

  async create(req: Request, data: BaseNoteDto): Promise<Note> {
    const userId = getReqUserId(req);
    const result = new this.NoteModel({...data, creator:userId});
    return await result.save();
  }

  async update(req: Request, {id, data}:IUpdateNote) {

    const userId = getReqUserId(req);
    const result = await this.NoteModel.findById(id);
    if (!result) {
      throw new HttpException('114 - Запись не найдена', HttpStatus.BAD_REQUEST);
    }
    if (result.creator !== userId){
      throw new HttpException('116 - Нет прав на редактирование записи', HttpStatus.BAD_REQUEST);
    }
    await result.updateOne(data)
    await result.save();
    return await this.NoteModel.findById(id)
  }

  async delete(req: Request, id: string) {
    const userId = getReqUserId(req);
    const note = await this.NoteModel.findById(id);
    if (!note) {
      throw new HttpException('114 - Запись не найдена', HttpStatus.BAD_REQUEST);
    }
    if (note.creator !== userId){
      throw new HttpException('115 - Нет прав на удаление записи', HttpStatus.BAD_REQUEST);
    }
    removeFilesBackground(note.images)
    const result = await note.delete()
    return result
  }
}
