import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class TimeBlockBundle extends Document {
  @Prop({ required: true })
  hours: number;

  @Prop({ required: true })
  price: number;
}
export const TimeBlockBundleSchema = SchemaFactory.createForClass(TimeBlockBundle);

@Schema({ _id: false })
export class MonthlyPass extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;
}
export const MonthlyPassSchema = SchemaFactory.createForClass(MonthlyPass);

@Schema({ _id: false })
export class PromoCode extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  discountPercentage: number;

  @Prop()
  validUntil: Date;
}
export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);

@Schema({ _id: false })
export class SpecialEventOverride extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  price: number;
}
export const SpecialEventOverrideSchema = SchemaFactory.createForClass(SpecialEventOverride);

@Schema({ _id: false })
export class Pricing extends Document {
  @Prop({ default: 0 })
  hourlyRate: number;

  @Prop({ default: 0 })
  dailyRate: number;

  @Prop({ default: 1 })
  peakMultiplier: number;

  @Prop({ default: 1 })
  offPeakMultiplier: number;

  @Prop({ type: [TimeBlockBundleSchema], default: [] })
  timeBlockBundles: TimeBlockBundle[];

  @Prop({ type: [MonthlyPassSchema], default: [] })
  monthlyPasses: MonthlyPass[];

  @Prop({ type: [PromoCodeSchema], default: [] })
  promoCodes: PromoCode[];

  @Prop({ type: [SpecialEventOverrideSchema], default: [] })
  specialEventOverrides: SpecialEventOverride[];
}
export const PricingSchema = SchemaFactory.createForClass(Pricing);
