import { SetMetadata } from '@nestjs/common';

export const RoleType = (roleType: string) => SetMetadata('roleType', roleType);
