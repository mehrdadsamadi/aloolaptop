import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty({
    example:
      'https://storage.c2.liara.space/aloolaptop/images-archive%2F1776632962224.jpg',
  })
  @IsString() 
  url: string;

  @ApiProperty({ example: 'images-archive/1776632962224.jpg' })
  @IsString()
  key: string;
}
