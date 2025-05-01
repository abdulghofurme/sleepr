import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../durrent-user.decorator';
import { UserDocument } from './models/user.schema';
import { JWTAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTAuthGuard)
  @Get('me')
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UseGuards(JWTAuthGuard)
  @Delete('me')
  async remove(@CurrentUser() user: UserDocument) {
    return this.usersService.remove(user._id.toHexString());
  }
}
