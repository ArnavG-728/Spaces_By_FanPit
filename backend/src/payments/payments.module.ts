import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsModule } from '../reservations/reservations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TransactionLog, TransactionLogSchema } from './schemas/transaction-log.schema';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TransactionLog.name, schema: TransactionLogSchema }]),
        ReservationsModule,
    NotificationsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
