import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { BookingsModule } from './bookings/bookings.module';
import { CheckInsModule } from './check-ins/check-ins.module';
import { IssuesModule } from './issues/issues.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SpacesModule,
    BookingsModule,
    CheckInsModule,
    IssuesModule,
    AuthModule,
    HealthModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
