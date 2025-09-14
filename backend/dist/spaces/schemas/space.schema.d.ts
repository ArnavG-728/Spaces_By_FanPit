import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type SpaceDocument = Space & Document;
export declare class Space {
    name: string;
    description: string;
    location: string;
    price: number;
    owner: User;
    amenities: string[];
    capacity: number;
    images: string[];
}
export declare const SpaceSchema: MongooseSchema<Space, import("mongoose").Model<Space, any, any, any, Document<unknown, any, Space, any, {}> & Space & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Space, Document<unknown, {}, import("mongoose").FlatRecord<Space>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Space> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
