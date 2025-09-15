import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Pricing, PricingSchema } from './pricing.schema';

export type SpaceDocument = Space & Document;

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: PricingSchema, default: () => ({}) })
  pricing: Pricing;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
