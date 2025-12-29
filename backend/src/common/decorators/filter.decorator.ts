import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ProductGrade } from '../../modules/product/enums/product-grade.enum';
import { ProductCondition } from '../../modules/product/enums/product-condition.enum';

export function FilterProduct() {
  return applyDecorators(
    ApiQuery({ name: 'categoryId', required: false, type: 'string' }),
    ApiQuery({ name: 'condition', required: false, enum: ProductCondition }),
    ApiQuery({ name: 'grade', required: false, enum: ProductGrade }),
    ApiQuery({ name: 'isActive', required: false, type: 'boolean' }),
    ApiQuery({ name: 'name', required: false, type: 'boolean' }),
  );
}

export function FilterCategory() {
  return applyDecorators(
    ApiQuery({ name: '_id', required: false, type: 'string' }),
    ApiQuery({ name: 'name', required: false, type: 'string' }),
  );
}
