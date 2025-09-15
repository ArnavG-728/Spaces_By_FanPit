import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ReservationsService } from '../reservations/reservations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TransactionLog, TransactionLogDocument } from './schemas/transaction-log.schema';
export declare class PaymentsService {
    private readonly transactionLogModel;
    private readonly reservationsService;
    private readonly configService;
    private readonly notificationsService;
    private readonly webhookSecret;
    constructor(transactionLogModel: Model<TransactionLogDocument>, reservationsService: ReservationsService, configService: ConfigService, notificationsService: NotificationsService);
    handleWebhook(event: any, signature: string): Promise<{
        received: boolean;
    }>;
    private verifySignature;
    private createTransactionLog;
    findAllLogs(): Promise<TransactionLog[]>;
}
