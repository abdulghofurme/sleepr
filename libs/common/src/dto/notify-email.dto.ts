import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
