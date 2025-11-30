import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from '../schemas/address.schema';
import { CreateAddressDto, UpdateAddressDto } from '../dto/user-address.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserAddressMessage } from '../../../common/enums/message.enum';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../../common/utils/pagination.util';
import { LocationType } from '../../../common/types/location.type';

@Injectable({ scope: Scope.REQUEST })
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,

    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    const userId = this.req.user?._id;

    const {
      latitude,
      longitude,
      isDefault,
      address,
      postalCode,
      state,
      title,
      city,
    } = createAddressDto;
    const location: LocationType = this.toGeo(longitude, latitude);

    const created = await this.addressModel.create({
      address,
      postalCode,
      state,
      title,
      city,
      location,
      userId,
      isDefault: !!isDefault,
    });

    // اگر isDefault=true بود، بقیه آدرس‌ها را غیر پیش‌فرض کن
    if (isDefault) {
      await this.addressModel.updateMany(
        { userId, _id: { $ne: created._id } },
        { $set: { isDefault: false } },
      );
    }

    return {
      message: UserAddressMessage.Created,
      address: created,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const userId = this.req.user?._id;

    const { page, limit, skip } = paginationSolver(paginationDto);

    const count = await this.addressModel.countDocuments();

    const addresses = await this.addressModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      addresses,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findOne(addressId: string) {
    const userId = this.req.user?._id;

    const address = await this.addressModel.findOne({ _id: addressId, userId });
    if (!address) throw new NotFoundException(UserAddressMessage.Notfound);

    return address;
  }

  async update(addressId: string, updateAddressDto: UpdateAddressDto) {
    const userId = this.req.user?._id;

    const {
      address,
      latitude,
      longitude,
      isDefault,
      state,
      title,
      city,
      postalCode,
    } = updateAddressDto;

    let location: LocationType | undefined = undefined;

    // اگر latitude/longitude داده شده، تبدیل کن به location
    if (latitude !== undefined || longitude !== undefined) {
      const lat = latitude ?? null;
      const lng = longitude ?? null;
      if (lat == null || lng == null) {
        throw new NotFoundException(UserAddressMessage.Location);
      }
      location = this.toGeo(lng, lat);
    }

    // اگر isDefault=true هست باید قبلی‌ها را unset کنیم پس ابتدا آپدیت انجام شود سپس سایر آدرس‌ها
    const updated = await this.addressModel.findOneAndUpdate(
      { _id: addressId, userId },
      {
        $set: {
          address,
          location,
          state,
          title,
          city,
          postalCode,
          ...(isDefault !== undefined && { isDefault: !!isDefault }),
        },
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException(UserAddressMessage.Notfound);

    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId, _id: { $ne: updated._id } },
        { $set: { isDefault: false } },
      );
    }

    return {
      message: UserAddressMessage.Updated,
      address: updated,
    };
  }

  async remove(addressId: string) {
    const userId = this.req.user?._id;

    const removed = await this.addressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });
    if (!removed) throw new NotFoundException(UserAddressMessage.Notfound);

    // اگر آدرس حذف شده پیش‌فرض بود و کاربر آدرس‌های دیگری دارد، آدرس اول را پیش‌فرض کن
    if (removed.isDefault) {
      const another = await this.addressModel
        .findOne({ userId })
        .sort({ createdAt: -1 });
      if (another) {
        await this.addressModel.findByIdAndUpdate(another._id, {
          $set: { isDefault: true },
        });
      }
    }
    return {
      message: UserAddressMessage.Deleted,
      address: removed,
    };
  }

  async setDefault(addressId: string) {
    const userId = this.req.user?._id;

    const address = await this.addressModel.findOne({ _id: addressId, userId });
    if (!address) throw new NotFoundException(UserAddressMessage.Notfound);

    // set all to false then set target true
    await this.addressModel.updateMany(
      { userId },
      { $set: { isDefault: false } },
    );

    address.isDefault = true;
    await address.save();

    return {
      message: UserAddressMessage.changeDefault,
      address,
    };
  }

  // optional: find nearest addresses to a point
  async findNear(longitude: number, latitude: number, maxDistance = 5000) {
    const userId = this.req.user?._id;

    return this.addressModel
      .find({
        userId,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: maxDistance,
          },
        },
      })
      .lean();
  }

  private toGeo(longitude: number, latitude: number): LocationType {
    return { type: 'Point' as const, coordinates: [longitude, latitude] };
  }
}
