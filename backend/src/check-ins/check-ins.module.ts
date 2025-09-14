import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckInsService } from './check-ins.service';
import { CheckInsController } from './check-ins.controller';
import { CheckIn, CheckInSchema } from './schemas/check-in.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CheckIn.name, schema: CheckInSchema }])],
  controllers: [CheckInsController],
  providers: [CheckInsService],
})
export class CheckInsModule {}
