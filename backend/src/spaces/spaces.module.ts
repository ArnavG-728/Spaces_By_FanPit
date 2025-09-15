import { Module, forwardRef, OnModuleInit } from '@nestjs/common';
import { ReservationsModule } from '../reservations/reservations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Space, SpaceSchema } from './schemas/space.schema';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]), forwardRef(() => ReservationsModule)],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    try {
      // Drop the problematic unique index if it exists
      const collection = this.connection.collection('spaces');
      await collection.dropIndex('pricing.promoCodes.code_1');
      console.log('Dropped problematic unique index on pricing.promoCodes.code');
    } catch (error) {
      // Index might not exist, which is fine
      console.log('Index pricing.promoCodes.code_1 does not exist or already dropped');
    }
  }
}
