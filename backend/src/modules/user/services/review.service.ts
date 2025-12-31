import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateReviewDto, UpdateReviewDto } from '../dto/user-review.dto';
import { UserReviewMessage } from '../../../common/enums/message.enum';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../../common/utils/pagination.util';
import { Product, ProductDocument } from '../../product/schema/product.schema';

@Injectable({ scope: Scope.REQUEST })
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const userId = this.req.user?._id;

    const { rating, comment, productId } = createReviewDto;

    const review = await this.reviewModel.create({
      userId,
      productId: new Types.ObjectId(productId),
      rating,
      comment,
    });

    // بعد از ساخت → میانگین را آپدیت کن
    await this.updateProductRate(review.productId.toString());

    return {
      message: UserReviewMessage.Created,
      review,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.reviewModel.countDocuments();

    const reviews = await this.reviewModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'userId',
          select: 'profile.firstName profile.lastName profile.avatar mobile',
        },
        { path: 'productId', select: 'name images rate' },
      ]);

    // const reviews = await this.reviewModel
    //   .aggregate([
    //     { $sort: { createdAt: -1 } },
    //     { $skip: skip },
    //     { $limit: limit },
    //
    //     // Join product → مشابه populate
    //     {
    //       $lookup: {
    //         from: 'products',
    //         localField: 'productId',
    //         foreignField: '_id',
    //         as: 'product',
    //       },
    //     },
    //
    //     // فقط یکی بگیر چون محصول یک دونه است
    //     { $unwind: '$product' },
    //
    //     // فقط اطلاعات لازم محصول را برگردان
    //     {
    //       $project: {
    //         userId: 1,
    //         productId: 1,
    //         rating: 1,
    //         comment: 1,
    //         isVisible: 1,
    //         createdAt: 1,
    //         updatedAt: 1,
    //
    //         product: {
    //           _id: '$product._id',
    //           name: '$product.name',
    //           image: { $arrayElemAt: ['$product.images', 0] }, // عکس اول
    //         },
    //       },
    //     },
    //   ])
    //   .exec();

    return {
      reviews,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async listVisitor(paginationDto: PaginationDto) {
    const userId = this.req.user?._id;

    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.reviewModel.countDocuments({ userId });

    const reviews = await this.reviewModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'userId',
          select: 'profile.firstName profile.lastName profile.avatar mobile',
        },
        { path: 'productId', select: 'name images rate' },
      ]);

    // const reviews = await this.reviewModel
    //   .aggregate([
    //     { $match: { userId } },
    //     { $sort: { createdAt: -1 } },
    //     { $skip: skip },
    //     { $limit: limit },
    //
    //     // Join product → مشابه populate
    //     {
    //       $lookup: {
    //         from: 'products',
    //         localField: 'productId',
    //         foreignField: '_id',
    //         as: 'product',
    //       },
    //     },
    //
    //     // فقط یکی بگیر چون محصول یک دونه است
    //     { $unwind: '$product' },
    //
    //     // فقط اطلاعات لازم محصول را برگردان
    //     {
    //       $project: {
    //         userId: 1,
    //         productId: 1,
    //         rating: 1,
    //         comment: 1,
    //         isVisible: 1,
    //         createdAt: 1,
    //         updatedAt: 1,
    //
    //         product: {
    //           _id: '$product._id',
    //           name: '$product.name',
    //           image: { $arrayElemAt: ['$product.images', 0] }, // عکس اول
    //         },
    //       },
    //     },
    //   ])
    //   .exec();

    return {
      reviews,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findOne(reviewId: string) {
    const review = await this.reviewModel
      .aggregate([
        {
          $match: { _id: new Types.ObjectId(reviewId) },
        },

        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
          },
        },

        { $unwind: '$product' },

        {
          $project: {
            userId: 1,
            productId: 1,
            rating: 1,
            comment: 1,
            isVisible: 1,
            createdAt: 1,
            updatedAt: 1,

            product: {
              _id: '$product._id',
              name: '$product.name',
              firstImage: { $arrayElemAt: ['$product.images', 0] },
            },
          },
        },
      ])
      .exec();

    if (!review || review.length === 0)
      throw new NotFoundException(UserReviewMessage.Notfound);

    return review[0]; // چون aggregate آرایه برمی‌گرداند
  }

  async findOneVisitor(reviewId: string) {
    const userId = this.req.user?._id;

    const review = await this.reviewModel
      .aggregate([
        {
          $match: { _id: new Types.ObjectId(reviewId), userId },
        },

        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
          },
        },

        { $unwind: '$product' },

        {
          $project: {
            userId: 1,
            productId: 1,
            rating: 1,
            comment: 1,
            isVisible: 1,
            createdAt: 1,
            updatedAt: 1,

            product: {
              _id: '$product._id',
              name: '$product.name',
              firstImage: { $arrayElemAt: ['$product.images', 0] },
            },
          },
        },
      ])
      .exec();

    if (!review || review.length === 0)
      throw new NotFoundException(UserReviewMessage.Notfound);

    return review[0]; // چون aggregate آرایه برمی‌گرداند
  }

  async getReviewsByProduct(productId: string, paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.reviewModel.countDocuments();

    const reviews = await this.reviewModel
      .find({ productId, isVisible: true })
      .populate('userId', 'profile.firstName profile.lastName avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      reviews,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async update(reviewId: string, updateReviewDto: UpdateReviewDto) {
    const userId = this.req.user?._id;

    const { rating, comment } = updateReviewDto;

    const review = await this.reviewModel.findOneAndUpdate(
      { _id: reviewId, userId },
      {
        $set: {
          rating,
          comment,
        },
      },
      { new: true },
    );

    if (!review) throw new NotFoundException(UserReviewMessage.Notfound);

    await this.updateProductRate(review.productId.toString());

    return {
      message: UserReviewMessage.Updated,
      review,
    };
  }

  async remove(reviewId: string) {
    const userId = this.req.user?._id;

    const review = await this.reviewModel.findOneAndDelete({
      _id: reviewId,
      userId,
    });

    if (!review) throw new NotFoundException(UserReviewMessage.Notfound);

    await this.updateProductRate(review.productId.toString());

    return {
      message: UserReviewMessage.Deleted,
      review,
    };
  }

  async changeVisibility(reviewId: string) {
    const review = await this.reviewModel.findOneAndUpdate(
      { _id: reviewId },
      [
        {
          $set: { isVisible: { $not: '$isVisible' } },
        },
      ],
      { new: true },
    );

    if (!review) throw new NotFoundException(UserReviewMessage.Notfound);

    await this.updateProductRate(review.productId.toString());

    return {
      message: UserReviewMessage.changeVisibility,
      review,
    };
  }

  private async updateProductRate(productId: string) {
    // تمام reviewهای visible را بگیر
    const stats = await this.reviewModel.aggregate([
      { $match: { productId: new Types.ObjectId(productId), isVisible: true } },

      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const avg = stats.length > 0 ? stats[0].avgRating : 0;

    // آپدیت محصول
    await this.productModel.findByIdAndUpdate(productId, {
      $set: { rate: avg },
    });
  }
}
