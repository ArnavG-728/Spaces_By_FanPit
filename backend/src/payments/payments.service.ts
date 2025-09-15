import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { ReservationsService } from '../reservations/reservations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TransactionLog, TransactionLogDocument, TransactionStatus } from './schemas/transaction-log.schema';

@Injectable()
export class PaymentsService {
  private readonly webhookSecret?: string;

  constructor(
    @InjectModel(TransactionLog.name) private readonly transactionLogModel: Model<TransactionLogDocument>,
    private readonly reservationsService: ReservationsService,
        private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {
        this.webhookSecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
  }

  async handleWebhook(event: any, signature: string) {
    // 1. Verify webhook signature
    const isValid = this.verifySignature(JSON.stringify(event), signature);
    if (!isValid) {
      throw new BadRequestException('Invalid Razorpay webhook signature');
    }

    // 2. Process the event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // Update reservation status and details
      const reservation = await this.reservationsService.handleSuccessfulPayment(
        orderId,
        payment.id,
        signature,
      );

      // Log the transaction
            await this.createTransactionLog(reservation, payment, TransactionStatus.SUCCESS, event);

      // 5. Send confirmation email
      // In a real app, you would look up the user's email from the reservation.userId
      await this.notificationsService.sendReservationConfirmation(reservation.userId, reservation as any);
    }

    // TODO: Handle other events like 'payment.failed' or 'refund.processed'

    return { received: true };
  }

  private verifySignature(body: string, signature: string): boolean {
    if (!this.webhookSecret) {
      throw new BadRequestException('Webhook secret is not configured.');
    }
    const hmac = crypto.createHmac('sha256', this.webhookSecret);
    hmac.update(body);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }

  private async createTransactionLog(
    reservation: any,
    payment: any,
    status: TransactionStatus,
    rawEvent: any,
  ): Promise<TransactionLog> {
    const log = new this.transactionLogModel({
      reservationId: reservation._id,
      spaceId: reservation.spaceId,
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
      status,
      rawEvent,
    });
    return log.save();
  }

  async findAllLogs(): Promise<TransactionLog[]> {
    return this.transactionLogModel.find().sort({ createdAt: -1 }).exec();
  }
}
