import { Model } from 'mongoose';
import { BookingDocument } from '../bookings/schemas/booking.schema';
export declare class PaymentsService {
    private bookingModel;
    private razorpay;
    constructor(bookingModel: Model<BookingDocument>);
    createOrder(bookingId: string, amount: number): Promise<any>;
    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        status: string;
    }>;
    handleWebhook(payload: any): Promise<void>;
}
