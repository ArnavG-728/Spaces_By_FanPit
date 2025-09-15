import { IsString, IsNotEmpty, IsDateString, IsMongoId } from 'class-validator';

export class CreateReservationDto {
  @IsMongoId()
  @IsNotEmpty()
  spaceId: string;

  // In a real app, this would come from the authenticated user context (e.g., JWT payload)
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
