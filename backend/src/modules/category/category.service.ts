// src/category/category.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryMessage,
  ExceptionMessage,
} from '../../common/enums/message.enum';
import { S3Service } from '../common/s3/s3.service';

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
      attributes,
    } = createCategoryDto;

    const { url, key } = await this.s3Service.uploadFile(image, 'category');

    const slug = this.makeSlug(name, CSlug);
    // ensure unique slug (append number if needed)
    let uniqueSlug = slug;
    let i = 1;
    while (await this.categoryModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${i++}`;
    }

    const category = await this.categoryModel.create({
      name,
      slug: uniqueSlug,
      parentId,
      isActive,
      order,
      description,
      image: url,
      imageKey: key,
      attributes,
    });

    return {
      message: CategoryMessage.Created,
      category,
    };
  }

  async findAll({ activeOnly = true } = {}) {
    const filter: any = {};
    if (activeOnly) filter.isActive = true;

    return this.categoryModel.find(filter).sort({ order: 1, name: 1 }).lean();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException(ExceptionMessage.InvalidId);

    const c = await this.categoryModel.findById(id);
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

    const category = await this.findById(id);

    if (image) {
      const { url, key } = await this.s3Service.uploadFile(image, 'category');

      if (url) {
        if (category?.imageKey)
          await this.s3Service.deleteFile(category?.imageKey);

        category.image = url;
        category.imageKey = key;
      }
    }

    if (slug) slug = this.makeSlug(slug);
    const updated = await this.categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          slug,
          attributes,
          description,
          image: category?.image,
          imageKey: category?.imageKey,
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

    return updated;
  }

  async remove(id: string) {
    // soft delete preferred: set isActive=false
    const deleted = await this.categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!deleted) throw new NotFoundException(CategoryMessage.Notfound);

    return deleted;
  }

  // Return categories as a tree array
  async getTree() {
    const cats = await this.categoryModel
      .find({})
      .sort({ order: 1, name: 1 })
      .lean();

    const map = new Map<string, any>();
    const roots: any[] = [];

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

  private makeSlug(name: string, provided?: string) {
    const base = provided?.trim() || name;
    return slugify(base, { lower: true, strict: true });
  }
}
