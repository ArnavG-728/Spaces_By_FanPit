import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    handleWebhook(event: any, signature: string): Promise<{
        received: boolean;
    }>;
    findAllLogs(): Promise<import("./schemas/transaction-log.schema").TransactionLog[]>;
    create(): void;
    findAll(): void;
    findOne(): void;
    update(): void;
    remove(): void;
}
