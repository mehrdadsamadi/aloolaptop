import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';
import { SwaggerConsumes } from '../../common/enums/swagger-consumes.enum';
import { uploadFileFieldsS3 } from '../../common/interceptors/upload-file.interceptor';
import { EXAMPLE_PRODUCT } from './examples/product.example';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { FilterProduct } from '../../common/decorators/filter.decorator';
import { FilterProductDto } from '../../common/dtos/filter.dto';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { extractFilters } from '../../common/utils/functions.util';

@Controller('products')
@ApiTags('Products')
@AuthDecorator()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @CanAccess(Roles.ADMIN)
  @ApiCreatedResponse({ schema: { example: EXAMPLE_PRODUCT } })
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(uploadFileFieldsS3([{ name: 'images', maxCount: 10 }]))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ) {
    return this.productService.create(createProductDto, files.images);
  }

  @Get()
  @SkipAuth()
  @Pagination()
  @FilterProduct()
  findAll(@Query() filterDto: FilterProductDto) {
    const { paginationDto, filter } = extractFilters(filterDto);

    return this.productService.findAll({ paginationDto, filter });
  }

  @Get(':id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  @CanAccess(Roles.ADMIN)
  @ApiCreatedResponse({ schema: { example: EXAMPLE_PRODUCT } })
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(uploadFileFieldsS3([{ name: 'images', maxCount: 10 }]))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: { images?: Express.Multer.File[] },
  ) {
    return this.productService.update(id, updateProductDto, files?.images);
  }

  @Delete(':id')
  @CanAccess(Roles.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Delete(':id/image')
  @CanAccess(Roles.ADMIN)
  removeImage(@Param('id') id: string, @Query('imageKey') imageKey: string) {
    return this.productService.removeImage(id, imageKey);
  }
}
