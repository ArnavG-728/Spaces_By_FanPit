import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Space } from '../../spaces/schemas/space.schema';
export type BookingDocument = Booking & Document;
export declare class Booking {
    space: Space;
    user: User;
    startTime: Date;
    endTime: Date;
    status: string;
    notes: string;
    amount: number;
    paymentStatus: string;
    paymentOrderId: string;
    paymentId: string;
    paidAt: Date;
    totalPrice: number;
}
export declare const BookingSchema: MongooseSchema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any, {}> & Booking & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Booking> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
