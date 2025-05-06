import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientGrpc, } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CurrentUserDto, PAYMENTS_SERVICE_NAME, PaymentsServiceClient } from '@app/common';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient;
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
  ) { }

  onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(PAYMENTS_SERVICE_NAME)
  }

  async create(
    createReservationDto: CreateReservationDto,
    { id: userId, email }: CurrentUserDto,
  ) {
    return this.paymentsService.createCharge({
      ...createReservationDto.charge,
      email,
    })
      .pipe(
        map((res) => {
          const reservation = new Reservation({
            ...createReservationDto,
            userId,
            invoiceId: res.id,
          });
          return this.reservationRepository.create(reservation);
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationRepository.findOne({ id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id });
  }
}
