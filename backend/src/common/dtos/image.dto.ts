import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/product1.jpg',
  })
  url: string;

  @ApiProperty({ example: 'product1.jpg' })
  key: string;
}
