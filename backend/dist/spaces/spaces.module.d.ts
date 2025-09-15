import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class SpacesModule implements OnModuleInit {
    private connection;
    constructor(connection: Connection);
    onModuleInit(): Promise<void>;
}
