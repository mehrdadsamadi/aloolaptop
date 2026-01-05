import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ProductGrade } from '../../modules/product/enums/product-grade.enum';
import { ProductCondition } from '../../modules/product/enums/product-condition.enum';
import { OrderStatus } from '../../modules/order/enums/order-status.enum';
import { TopSellingSortBy } from '../../modules/statistic/enums/top-selling-sortBy.enum';

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

export function FilterOrder() {
  return applyDecorators(
    ApiQuery({
      name: 'status',
      required: false,
      type: 'enum',
      enum: OrderStatus,
    }),
  );
}

export function FilterTopSellingProducts() {
  return applyDecorators(
    ApiQuery({ name: 'limit', required: false, type: 'number', default: 10 }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: 'enum',
      enum: TopSellingSortBy,
      default: TopSellingSortBy.REVENUE,
    }),
  );
}
