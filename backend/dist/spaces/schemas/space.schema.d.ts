import { Document } from 'mongoose';
import { Pricing } from './pricing.schema';
export type SpaceDocument = Space & Document;
export declare class Space {
    name: string;
    description: string;
    address: string;
    capacity: number;
    amenities: string[];
    images: string[];
    pricing: Pricing;
}
export declare const SpaceSchema: import("mongoose").Schema<Space, import("mongoose").Model<Space, any, any, any, Document<unknown, any, Space, any, {}> & Space & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Space, Document<unknown, {}, import("mongoose").FlatRecord<Space>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Space> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
