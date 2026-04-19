import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ImageArchive,
  ImageArchiveDocument,
} from './schema/imageArchive.schema';
import { Model } from 'mongoose';
import { AddImageDto } from './dto/add-image.dto';
import { S3Service } from '../common/services/s3/s3.service';
import {
  ExceptionMessage,
  ImageArchiveMessage,
} from 'src/common/enums/message.enum';
import { isValidObjectId } from 'src/common/utils/functions.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';

@Injectable()
export class ImageArchiveService {
  constructor(
    @InjectModel(ImageArchive.name)
    private readonly imageArchiveModel: Model<ImageArchiveDocument>,

    private s3Service: S3Service,
  ) {}

  async add(addImageDto: AddImageDto, image: Express.Multer.File) {
    const { title } = addImageDto;

    const uploaded = await this.s3Service.uploadFile(image, 'images-archive');
    let url = uploaded.url;
    let key = uploaded.key;

    const imageArchive = await this.imageArchiveModel.create({
      title,
      image: { url, key },
    });

    return {
      message: ImageArchiveMessage.Add,
      image: imageArchive,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.imageArchiveModel.countDocuments();

    const images = await this.imageArchiveModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      images,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findById(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException(ExceptionMessage.InvalidId);

    const image = await this.imageArchiveModel.findById(id);

    if (!image) throw new NotFoundException(ImageArchiveMessage.Notfound);

    return image;
  }

  async remove(id: string) {
    const archive = await this.findById(id);

    await this.s3Service.deleteFile(archive.image.key);

    await this.imageArchiveModel.deleteOne({ _id: id });

    return {
      message: ImageArchiveMessage.Deleted,
    };
  }
}
