import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../schemas/reservation.schema';

export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;
}
