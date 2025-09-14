import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SpaceDocument = Space & Document;

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  pricePerHour!: number;

  @Prop({ required: true })
  capacity!: number;

  @Prop({ type: [String], default: [] })
  amenities!: string[];
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
