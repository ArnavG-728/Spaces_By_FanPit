import { Document, Schema as MongooseSchema } from 'mongoose';
import { Booking } from '../../bookings/schemas/booking.schema';
import { User } from '../../users/schemas/user.schema';
export type CheckInDocument = CheckIn & Document;
export declare class CheckIn {
    booking: Booking;
    staff: User;
    checkInTime: Date;
}
export declare const CheckInSchema: MongooseSchema<CheckIn, import("mongoose").Model<CheckIn, any, any, any, Document<unknown, any, CheckIn, any, {}> & CheckIn & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CheckIn, Document<unknown, {}, import("mongoose").FlatRecord<CheckIn>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CheckIn> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
