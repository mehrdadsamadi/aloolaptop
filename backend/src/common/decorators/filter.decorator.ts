import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ProductGrade } from '../../modules/product/enums/product-grade.enum';
import { ProductCondition } from '../../modules/product/enums/product-condition.enum';
import { OrderStatus } from '../../modules/order/enums/order-status.enum';
import { TopSellingSortBy } from '../../modules/statistic/enums/top-selling-sortBy.enum';
import { ExportFormats } from '../../modules/common/services/export/export.service';

export function FilterProduct() {
  return applyDecorators(
    ApiQuery({ name: 'categoryId', required: false, type: String }),
    ApiQuery({ name: 'condition', required: false, enum: ProductCondition }),
    ApiQuery({ name: 'grade', required: false, enum: ProductGrade }),
    ApiQuery({ name: 'isActive', required: false, type: Boolean }),
    ApiQuery({ name: 'name', required: false, type: Boolean }),
  );
}

export function FilterFeaturedProduct() {
  return applyDecorators(
    ApiQuery({ name: 'limit', required: false, type: Number, default: 8 }),
  );
}

export function FilterBestSellerProduct() {
  return applyDecorators(
    ApiQuery({ name: 'limit', required: false, type: Number, default: 8 }),
    ApiQuery({ name: 'days', required: false, type: Number, default: 30 }),
  );
}

export function FilterCategory() {
  return applyDecorators(
    ApiQuery({ name: '_id', required: false, type: String }),
    ApiQuery({ name: 'name', required: false, type: String }),
  );
}

export function FilterOrder() {
  return applyDecorators(
    ApiQuery({
      name: 'status',
      required: false,
      enum: OrderStatus,
    }),
  );
}

export function FilterTopSellingProducts() {
  return applyDecorators(
    ApiQuery({ name: 'limit', required: false, type: Number, default: 10 }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      enum: TopSellingSortBy,
      default: TopSellingSortBy.REVENUE,
    }),
  );
}

export function FilterOrderExport() {
  return applyDecorators(
    ApiQuery({
      name: 'status',
      required: true,
      enum: OrderStatus,
    }),
    ApiQuery({
      name: 'format',
      required: true,
      enum: ExportFormats,
    }),
  );
}
