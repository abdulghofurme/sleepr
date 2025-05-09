import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationsService } from './reservations.service';
import { Reservation } from './models/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser, CurrentUserDto, JWTAuthGuard } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly logger: Logger,
  ) {}

  @Query(() => [Reservation], { name: 'reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Mutation(() => Reservation)
  @UseGuards(JWTAuthGuard)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reservationsService.create(createReservationInput, user);
  }

  @Query(() => Reservation, { name: 'reservation' })
  findOne(@Args('id', { type: () => Number }) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Mutation(() => Reservation)
  @UseGuards(JWTAuthGuard)
  removeReservation(@Args('id', { type: () => Number }) id: number) {
    return this.reservationsService.remove(id);
  }
}
