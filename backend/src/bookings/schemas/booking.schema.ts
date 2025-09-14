import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Space } from '../../spaces/schemas/space.schema';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Space', required: true })
  space: Space;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' })
  status: string;

  @Prop()
  notes: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ enum: ['pending', 'completed', 'failed'], default: 'pending' })
  paymentStatus: string;

  @Prop()
  paymentOrderId: string;

  @Prop()
  paymentId: string;

  @Prop()
  paidAt: Date;

  @Prop({ required: true })
  totalPrice: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
