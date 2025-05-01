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

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reservationsService.create({
      ...createReservationDto,
      userId: user._id,
    });
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
