import { IsOptional, IsString, IsDateString, IsEnum, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../schemas/reservation.schema';

export class FindReservationsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by Space ID' })
  @IsOptional()
  @IsMongoId()
  spaceId?: string;

  @ApiPropertyOptional({ description: 'Filter by a specific date (will find reservations active on this day)' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Filter by reservation status', enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ description: 'Filter by User ID' })
  @IsOptional()
  @IsString() // Assuming userId is a string for now
  userId?: string;
}
