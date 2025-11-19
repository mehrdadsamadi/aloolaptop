import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from '../schemas/address.schema';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}
}
