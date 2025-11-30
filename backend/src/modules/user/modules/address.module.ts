import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from '../schemas/address.schema';
import { AddressController } from '../controllers/address.controller';
import { AddressService } from '../services/address.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService, MongooseModule],
})
export class AddressModule {}
