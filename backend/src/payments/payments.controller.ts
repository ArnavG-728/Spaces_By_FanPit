import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder(@Body() body: { bookingId: string; amount: number }) {
    return this.paymentsService.createOrder(body.bookingId, body.amount);
  }

  @Post('verify')
  async verifyPayment(@Body() body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    return this.paymentsService.verifyPayment(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
