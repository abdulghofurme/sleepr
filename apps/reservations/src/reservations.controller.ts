import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CurrentUser, CurrentUserDto, JWTAuthGuard } from '@app/common';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('health-check')
  async healthCheck() {
    return { healhtCheck: true };
  }

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.reservationsService.findOne(+id);
  }

  // @Patch(':id')
  // @UseGuards(JWTAuthGuard)
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateReservationDto: UpdateReservationDto,
  // ) {
  //   return this.reservationsService.update(+id, updateReservationDto);
  // }

  @Delete(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: number) {
    return this.reservationsService.remove(+id);
  }
}
