import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
    });
  }

  async createOrder(bookingId: string, amount: number) {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        booking_id: bookingId,
      },
    };

    const order = await this.razorpay.orders.create(options);
    
    // Update booking with payment details
    await this.bookingModel.findByIdAndUpdate(bookingId, {
      paymentOrderId: order.id,
      paymentStatus: 'pending',
      amount: amount,
    });

    return order;
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const crypto = require('crypto');
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      // Update booking status
      await this.bookingModel.findOneAndUpdate(
        { paymentOrderId: razorpayOrderId },
        { 
          paymentStatus: 'completed',
          paymentId: razorpayPaymentId,
          paidAt: new Date(),
        }
      );
      return { status: 'success' };
    } else {
      return { status: 'failure' };
    }
  }

  async handleWebhook(payload: any) {
    const event = payload.event;
    const paymentEntity = payload.payload.payment.entity;

    switch (event) {
      case 'payment.captured':
        await this.bookingModel.findOneAndUpdate(
          { paymentOrderId: paymentEntity.order_id },
          { 
            paymentStatus: 'completed',
            paymentId: paymentEntity.id,
            paidAt: new Date(),
          }
        );
        break;
      case 'payment.failed':
        await this.bookingModel.findOneAndUpdate(
          { paymentOrderId: paymentEntity.order_id },
          { paymentStatus: 'failed' }
        );
        break;
    }
  }
}
