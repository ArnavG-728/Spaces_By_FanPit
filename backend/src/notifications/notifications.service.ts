import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Reservation } from '../reservations/schemas/reservation.schema';

@Injectable()
export class NotificationsService {
  private transporter: Transporter;
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<number>('EMAIL_PORT') === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendReservationConfirmation(userEmail: string, reservation: Reservation & { spaceId: { name: string } }) {
    const { spaceId, startTime, endTime, totalPrice } = reservation;

    const subject = `Your Reservation for ${spaceId.name} is Confirmed!`;
    const text = `Hello,\n\nYour reservation for ${spaceId.name} from ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()} is confirmed.\n\nTotal Price: ₹${totalPrice}\n\nThank you for booking with us!`;
    const html = `<p>Hello,</p><p>Your reservation for <strong>${spaceId.name}</strong> from <strong>${new Date(startTime).toLocaleString()}</strong> to <strong>${new Date(endTime).toLocaleString()}</strong> is confirmed.</p><p>Total Price: <strong>₹${totalPrice}</strong></p><p>Thank you for booking with us!</p>`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: userEmail, // In a real app, you'd fetch the user's email from the userId
        subject,
        text,
        html,
      });
      this.logger.log(`Reservation confirmation email sent to ${userEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email to ${userEmail}`, error.stack);
    }
  }
}
