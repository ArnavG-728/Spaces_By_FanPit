import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Space } from '../../spaces/schemas/space.schema';

export type ReservationDocument = Reservation & Document;

export enum ReservationStatus {
  PENDING = 'pending', // Awaiting payment
  CONFIRMED = 'confirmed', // Payment successful
  CANCELLED = 'cancelled', // User or staff cancelled
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
  NO_SHOW = 'no-show',
}

@Schema({ _id: false })
class PaymentDetails {
  @Prop()
  orderId: string;

  @Prop()
  paymentId: string;

  @Prop()
  signature: string;
}

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Space', required: true })
  spaceId: Space;

  // For now, we'll use a simple string for userId. This will be updated when auth is added.
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Prop({ type: PaymentDetails })
  paymentDetails: PaymentDetails;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
