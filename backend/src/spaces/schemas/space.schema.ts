import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SpaceDocument = Space & Document;

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop([String])
  amenities: string[];

  @Prop()
  capacity: number;

  @Prop([String])
  images: string[];
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
