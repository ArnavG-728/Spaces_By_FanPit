import { Document, Schema as MongooseSchema } from 'mongoose';
import { Space } from '../../spaces/schemas/space.schema';
import { User } from '../../users/schemas/user.schema';
export type IssueDocument = Issue & Document;
export declare class Issue {
    title: string;
    description: string;
    status: string;
    space: Space;
    reportedBy: User;
    assignedTo: User;
}
export declare const IssueSchema: MongooseSchema<Issue, import("mongoose").Model<Issue, any, any, any, Document<unknown, any, Issue, any, {}> & Issue & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Issue, Document<unknown, {}, import("mongoose").FlatRecord<Issue>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Issue> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
