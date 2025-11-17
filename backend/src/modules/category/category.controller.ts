import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';
import { SwaggerConsumes } from '../../common/enums/swagger-consumes.enum';
import { EXAMPLE_CATEGORY } from './examples/category.example';
import { UploadFileS3 } from '../../common/interceptors/upload-file.interceptor';

@Controller('categories')
@ApiTags('Categories')
@AuthDecorator()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CanAccess(Roles.ADMIN)
  @ApiCreatedResponse({ schema: { example: EXAMPLE_CATEGORY } })
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  @CanAccess(Roles.ADMIN)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('tree')
  @SkipAuth()
  getTree() {
    return this.categoryService.getTree();
  }

  @Get(':id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Patch(':id')
  @CanAccess(Roles.ADMIN)
  @ApiCreatedResponse({ schema: { example: EXAMPLE_CATEGORY } })
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @Delete(':id')
  @CanAccess(Roles.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
