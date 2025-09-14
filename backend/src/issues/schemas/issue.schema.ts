import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Space } from '../../spaces/schemas/space.schema';
import { User } from '../../users/schemas/user.schema';

export type IssueDocument = Issue & Document;

@Schema({ timestamps: true })
export class Issue {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Space', required: true })
  space: Space;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  reportedBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedTo: User;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
