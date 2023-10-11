import { IParents, IUpdateUserData } from 'src/types';

export class UpdateRelativeDto {
  readonly relativeId: string;
  readonly data: IUpdateUserData;
  readonly parents?: IParents;
}
