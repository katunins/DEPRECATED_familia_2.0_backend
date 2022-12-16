export class RelativeDto {
  readonly name: string;
  readonly userPic: string;
  readonly about: string;
  readonly birthday: string;
  readonly parents: {
    mother: string
    father: string
  }
  readonly access: {
    creatorId: string;
    shareId: [string];
  };
}
