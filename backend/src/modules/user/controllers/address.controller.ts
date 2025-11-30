import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from '../services/address.service';
import { AuthDecorator } from '../../../common/decorators/auth.decorator';
import { Pagination } from '../../../common/decorators/pagination.decorator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { SwaggerConsumes } from '../../../common/enums/swagger-consumes.enum';
import { CreateAddressDto, UpdateAddressDto } from '../dto/user-address.dto';
import { EXAMPLE_ADDRESS } from '../examples/address.example';

@Controller('address')
@ApiTags('Address')
@AuthDecorator()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: EXAMPLE_ADDRESS } })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.addressService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ schema: { example: EXAMPLE_ADDRESS } })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }

  @Patch(':id/set-default')
  setDefault(@Param('id') id: string) {
    return this.addressService.setDefault(id);
  }
}
