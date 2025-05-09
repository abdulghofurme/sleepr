import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class RoleDto {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  name?: string;
}
