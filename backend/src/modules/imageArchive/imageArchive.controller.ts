import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { ImageArchiveService } from './imageArchive.service';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { EXAMPLE_IMAGE_ARCHIVE } from './examples/imageArchive.example';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { AddImageDto } from './dto/add-image.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('imagesArchive')
@ApiTags('ImagesArchive')
@AuthDecorator()
export class ImageArchiveContrroler {
  constructor(private readonly imageArchiveService: ImageArchiveService) {}

  @Post('add')
  @CanAccess(Roles.ADMIN)
  @ApiCreatedResponse({ schema: { example: EXAMPLE_IMAGE_ARCHIVE } })
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @Body() addImageDto: AddImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.imageArchiveService.add(addImageDto, image);
  }

  @Get()
  @Pagination()
  @CanAccess(Roles.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.imageArchiveService.findAll(paginationDto);
  }

  @Delete(':id')
  @CanAccess(Roles.ADMIN)
  remove(@Param('id') id: string) {
    return this.imageArchiveService.remove(id);
  }
}
