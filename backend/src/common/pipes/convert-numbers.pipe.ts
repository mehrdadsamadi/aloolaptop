import { Injectable, PipeTransform } from '@nestjs/common';
import { convertToEnglishNumbers } from '../utils/functions.util';

@Injectable()
export class ConvertNumbersPipe implements PipeTransform {
  transform(value: any) {
    return convertToEnglishNumbers(value);
  }
}
