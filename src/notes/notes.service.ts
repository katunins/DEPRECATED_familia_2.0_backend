import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Note, NoteDocument} from './schemas/note.schema';
import {NoteDto} from './dto/note.dto';
import {INoteUpdateData} from './notes.controller';
import {getDataModelWithPagination, getReqUserId, removeFilesBackground} from 'src/helper';
import {INotesQuery, IPaginationRequest, IRelativesNotesQuery, ISearchData} from 'src/types';

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
}
