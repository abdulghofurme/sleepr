import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';
import {
  CurrentUserDto,
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
} from '@app/common';
import { PrismaService } from './prisma/prisma.service';
import { Long } from '@grpc/proto-loader';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient;
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  async onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }

  async create(
    createReservationDto: CreateReservationDto,
    { id: userId, email }: CurrentUserDto,
  ) {
    return this.paymentsService
      .createCharge({
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          return this.prismaService.reservation.create({
            data: {
              startDate: createReservationDto.startDate,
              endDate: createReservationDto.endDate,
              userId:
                typeof userId === 'object'
                  ? (userId as Long).toNumber()
                  : userId,
              invoiceId: res.id,
            },
          });
        }),
      );
  }

  async findAll() {
    return this.prismaService.reservation.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.reservation.findFirstOrThrow({ where: { id } });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.reservation.delete({ where: { id } });
  }
}
