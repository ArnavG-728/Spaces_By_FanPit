import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(body: {
        bookingId: string;
        amount: number;
    }): Promise<any>;
    verifyPayment(body: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{
        status: string;
    }>;
    handleWebhook(payload: any): Promise<void>;
}
