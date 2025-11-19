import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}
