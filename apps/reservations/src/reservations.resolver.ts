import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationsService } from './reservations.service';
import { Reservation } from './models/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser, CurrentUserDto } from '@app/common';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Query(() => [Reservation], { name: 'reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }
  // TODO: fix bug private query/mutation on @CurrentUser
  // @Mutation(() => Reservation)
  // creataReservation(
  //   @Args('createReservationInput')
  //   createReservationInput: CreateReservationDto,
  //   @CurrentUser() user: CurrentUserDto,
  // ) {
  //   return this.reservationsService.create(createReservationInput, user);
  // }

  @Query(() => Reservation, { name: 'reservation' })
  findOne(@Args('id', { type: () => Number }) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Mutation(() => Reservation)
  removeReservation(@Args('id', { type: () => Number }) id: number) {
    return this.reservationsService.remove(id);
  }
}
