import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JWTAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, CurrentUserDto } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTAuthGuard)
  @Get('me')
  async getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }

  @UseGuards(JWTAuthGuard)
  @Delete('me')
  async remove(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.remove(user._id);
  }
}
