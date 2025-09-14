import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Booking } from '../../bookings/schemas/booking.schema';
import { User } from '../../users/schemas/user.schema';

export type CheckInDocument = CheckIn & Document;

@Schema({ timestamps: true })
export class CheckIn {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
  booking: Booking;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  staff: User;

  @Prop({ default: Date.now })
  checkInTime: Date;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
