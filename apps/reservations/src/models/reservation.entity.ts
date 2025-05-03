import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  userId: number;

  @Column()
  invoiceId: string;
}
