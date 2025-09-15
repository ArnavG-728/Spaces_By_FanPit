import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionLogDocument = TransactionLog & Document;

export enum TransactionStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class TransactionLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reservation', required: true })
  reservationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Space', required: true })
  spaceId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  razorpayOrderId: string;

  @Prop()
  razorpayPaymentId: string;

  @Prop({ type: String, enum: Object.values(TransactionStatus), required: true })
  status: TransactionStatus;

  @Prop({ type: Object })
  rawEvent: any; // To store the full webhook payload for auditing
}

export const TransactionLogSchema = SchemaFactory.createForClass(TransactionLog);
