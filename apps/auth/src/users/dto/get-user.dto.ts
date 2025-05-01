import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  _id: string;
}
