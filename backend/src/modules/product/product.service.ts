import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { S3Service } from '../common/s3/s3.service';
import {
  isValidObjectId,
  makeSlug,
  parseAttributes,
} from '../../common/utils/functions.util';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../common/utils/pagination.util';
import { ImageType } from '../../common/types/image.type';
import {
  CategoryMessage,
  ExceptionMessage,
  ProductMessage,
} from '../../common/enums/message.enum';
import { CategoryService } from '../category/category.service';
import { FilterProductDto } from '../../common/dtos/filter.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly categoryService: CategoryService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createDto: CreateProductDto,
    imagesFiles?: Express.Multer.File[],
  ) {
    const {
      name,
      slug: PSlug,
      attributes: PAttributes,
      description,
      discountExpiresAt,
      discountPercent,
      isActive,
      condition,
      categoryId,
      price,
      stock,
      grade,
    } = createDto;

    if (categoryId) {
      if (!isValidObjectId(categoryId))
        throw new BadRequestException(CategoryMessage.InvalidId);

      const category = await this.categoryService.findByIdVisitor(categoryId);
      if (!category) throw new NotFoundException(CategoryMessage.Notfound);
    }

    const slug = makeSlug(name, PSlug);

    // parse attributes if sent as string
    const attributes = parseAttributes(PAttributes);

    // upload images if provided (array of files)
    const images: ImageType[] = [];
    if (imagesFiles && imagesFiles.length) {
      for (const file of imagesFiles) {
        const { key, url } = await this.s3Service.uploadFile(file, 'products');
        images.push({ url, key });
      }
    }

    try {
      const created = await this.productModel.create({
        name,
        slug,
        description,
        discountExpiresAt,
        discountPercent,
        isActive,
        condition,
        categoryId,
        price,
        stock,
        grade,
        attributes,
        images: images.length ? images : [],
      });

      return {
        message: ProductMessage.Created,
        product: created,
      };
    } catch (err) {
      // handle duplicate slug
      if (err?.code === 11000 && err?.keyPattern?.slug) {
        throw new BadRequestException(ExceptionMessage.UnUniqueSlug);
      }
      throw new InternalServerErrorException(
        err.message || ExceptionMessage.Server,
      );
    }
  }

  async findAll({
    filter = {},
    paginationDto,
  }: {
    filter?: FilterProductDto;
    paginationDto: PaginationDto;
  }) {
    // paginationSolver should return { page, limit, skip }
    const { page, limit, skip } = paginationSolver(paginationDto);

    const finalFilter = { ...filter };

    const count = await this.productModel.countDocuments(finalFilter);
    const products = await this.productModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      products,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findById(id: string) {
    if (!isValidObjectId(id))
      throw new NotFoundException(ExceptionMessage.InvalidId);

    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException(ProductMessage.Notfound);

    return product;
  }

  async update(
    id: string,
    updateDto: UpdateProductDto,
    imageFiles?: Express.Multer.File[],
  ) {
    const product = await this.findById(id);

    let {
      slug,
      attributes,
      categoryId,
      price,
      stock,
      grade,
      description,
      discountExpiresAt,
      discountPercent,
      isActive,
      condition,
      name,
    } = updateDto;

    // parse attributes if needed
    if (attributes) {
      attributes = parseAttributes(attributes);
    }

    // handle slug
    if (slug) slug = makeSlug(slug);

    // upload new images if provided (append to images array)
    const uploadedImages: ImageType[] = [];

    if (imageFiles && imageFiles.length) {
      for (const file of imageFiles) {
        const { key, url } = await this.s3Service.uploadFile(file, 'products');
        uploadedImages.push({ url, key });
      }
    }

    const updated = await this.productModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          slug,
          attributes,
          images: uploadedImages,
          categoryId,
          price,
          stock,
          grade,
          description,
          discountExpiresAt,
          discountPercent,
          isActive,
          condition,
        },
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException(ProductMessage.Notfound);

    return {
      message: ProductMessage.Updated,
      product: updated,
    };
  }

  async remove(id: string) {
    const product = await this.findById(id);

    // delete images from S3
    if (product.images && product.images.length) {
      for (const img of product.images) {
        if (img.key) {
          try {
            await this.s3Service.deleteFile(img.key);
          } catch (e) {
            // ignore single failures, but log if you want
          }
        }
      }
    }

    // remove document
    await this.productModel.deleteOne({ _id: id });

    return { message: ProductMessage.Deleted };
  }

  // optional: remove single image by key
  async removeImage(productId: string, imageKey: string) {
    const product = await this.findById(productId);

    const images = product.images || [];
    const idx = images.findIndex((i) => i.key === imageKey);
    if (idx === -1) throw new NotFoundException(ProductMessage.ImageNotfound);

    // delete from s3
    await this.s3Service.deleteFile(imageKey);

    images.splice(idx, 1);

    product.images = images;
    await product.save();

    return {
      message: ProductMessage.DeleteImage,
      product,
    };
  }
}
