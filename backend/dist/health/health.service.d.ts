import { HttpService } from '@nestjs/axios';
import { Connection } from 'mongoose';
export declare class HealthService {
    private readonly http;
    private readonly connection;
    constructor(http: HttpService, connection: Connection);
    check(): Promise<{
        status: string;
        db: string;
        probe: boolean | null;
        time: string;
    }>;
}
