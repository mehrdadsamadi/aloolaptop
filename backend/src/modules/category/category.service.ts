// src/category/category.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryMessage,
  ExceptionMessage,
} from '../../common/enums/message.enum';
import { S3Service } from '../common/services/s3/s3.service';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../common/utils/pagination.util';
import {
  isValidObjectId,
  makeSlug,
  parseAttributes,
} from '../../common/utils/functions.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    private s3Service: S3Service,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    const {
      name,
      slug: CSlug,
      parentId,
      isActive,
      order,
      description,
      attributes: CAttributes,
    } = createCategoryDto;

    if (parentId) {
      if (!isValidObjectId(parentId))
        throw new BadRequestException(CategoryMessage.InvalidParentId);

      const parent = await this.findByIdVisitor(parentId);
      if (!parent) throw new NotFoundException(CategoryMessage.NotfoundParent);
    }

    const { url, key } = await this.s3Service.uploadFile(image, 'categories');

    const slug = makeSlug(name, CSlug);
    // ensure unique slug (append number if needed)
    let uniqueSlug = slug;
    let i = 1;
    while (await this.categoryModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${i++}`;
    }

    // parse attributes if sent as string
    const attributes = parseAttributes(CAttributes);

    const category = await this.categoryModel.create({
      name,
      slug: uniqueSlug,
      parentId,
      isActive,
      order,
      description,
      image: { url, key },
      attributes,
    });

    return {
      message: CategoryMessage.Created,
      category,
    };
  }

  async findAll({
    activeOnly = true,
    paginationDto,
  }: {
    activeOnly?: boolean;
    paginationDto: PaginationDto;
  }) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const filter: CategoryDocument | { isActive?: boolean } = {};
    if (activeOnly) filter.isActive = true;

    // 1) تعداد کلی مطابق فیلتر
    const count = await this.categoryModel.countDocuments(filter);

    // 2) گرفتن صفحه مورد نظر با skip/limit و مرتب‌سازی
    const categories = await this.categoryModel
      .find(filter)
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'parent',
        select: '_id name',
      });

    // 3) برگردوندن لیست و اطلاعات pagination
    return {
      categories,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findById(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException(ExceptionMessage.InvalidId);

    const c = await this.categoryModel.findById(id);
    if (!c) throw new NotFoundException(CategoryMessage.Notfound);

    return c;
  }

  async findByIdVisitor(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException(ExceptionMessage.InvalidId);

    const c = await this.categoryModel.findOne({ _id: id, isActive: true });
    if (!c) throw new NotFoundException(CategoryMessage.Notfound);

    return c;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    let { name, slug, attributes, description, order, parentId, isActive } =
      updateCategoryDto;

    if (!isValidObjectId(id))
      throw new BadRequestException(ExceptionMessage.InvalidId);
    const category = await this.findById(id);

    if (parentId) {
      if (!isValidObjectId(parentId))
        throw new BadRequestException(CategoryMessage.InvalidParentId);

      const parent = await this.findByIdVisitor(parentId);
      if (!parent) throw new NotFoundException(CategoryMessage.NotfoundParent);
    }

    if (image) {
      const { url, key } = await this.s3Service.uploadFile(image, 'category');

      if (url) {
        if (category?.image) {
          await this.s3Service.deleteFile(category?.image?.key);

          category.image.url = url;
          category.image.key = key;
        }
      }
    }

    if (slug) slug = makeSlug(slug);
    const updated = await this.categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          slug,
          attributes,
          description,
          image: {
            url: category?.image?.url,
            key: category?.image?.key,
          },
          order,
          parentId,
          isActive,
        },
      },
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException(CategoryMessage.Notfound);

    return {
      message: CategoryMessage.Updated,
      category: updated,
    };
  }

  async remove(id: string) {
    // soft delete preferred: set isActive=false
    if (!isValidObjectId(id))
      throw new BadRequestException(ExceptionMessage.InvalidId);

    const deleted = await this.categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!deleted) throw new NotFoundException(CategoryMessage.Notfound);

    return {
      message: CategoryMessage.Deleted,
      category: deleted,
    };
  }

  // Return categories as a tree array
  async getTree() {
    const cats = await this.categoryModel
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const map = new Map<string, any>();
    const roots: CategoryDocument[] = [];

    for (const c of cats) {
      map.set(String(c._id), { ...c, children: [] });
    }
    for (const c of cats) {
      const pid = c.parentId ? String(c.parentId) : null;
      if (pid && map.has(pid)) {
        map.get(pid).children.push(map.get(String(c._id)));
      } else {
        roots.push(map.get(String(c._id)));
      }
    }

    return roots;
  }
}
