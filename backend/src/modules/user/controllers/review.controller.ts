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
import { ReviewService } from '../services/review.service';
import { AuthDecorator } from '../../../common/decorators/auth.decorator';
import { SwaggerConsumes } from '../../../common/enums/swagger-consumes.enum';
import { Pagination } from '../../../common/decorators/pagination.decorator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { EXAMPLE_REVIEW } from '../examples/review.example';
import { CreateReviewDto, UpdateReviewDto } from '../dto/user-review.dto';
import { CanAccess } from '../../../common/decorators/role.decorator';
import { Roles } from '../../../common/enums/role.enum';

@Controller('reviews')
@ApiTags('Reviews')
@AuthDecorator()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: EXAMPLE_REVIEW } })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @Pagination()
  @CanAccess(Roles.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reviewService.findAll(paginationDto);
  }

  @Get(':id')
  @CanAccess(Roles.ADMIN)
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get('visitor')
  @Pagination()
  listVisitor(@Query() paginationDto: PaginationDto) {
    return this.reviewService.listVisitor(paginationDto);
  }

  @Get(':id/visitor')
  findOneVisitor(@Param('id') id: string) {
    return this.reviewService.findOneVisitor(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ schema: { example: EXAMPLE_REVIEW } })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  @Patch(':id/change-visibility')
  changeVisibility(@Param('id') id: string) {
    return this.reviewService.changeVisibility(id);
  }
}
