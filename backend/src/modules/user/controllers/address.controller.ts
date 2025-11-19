import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from '../services/address.service';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
}
