import { Role } from '@app/common/models/role.entity';

export class CurrentUserDto {
  id: number;
  email: string;
  roles: Role[];
}
