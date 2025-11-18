import { ProductCondition } from '../../modules/product/enums/product-condition.enum';
import { ProductGrade } from '../../modules/product/enums/product-grade.enum';

export class FilterProductDto {
  categoryId?: string;
  condition?: ProductCondition;
  grade?: ProductGrade;
  isActive?: boolean;
}
