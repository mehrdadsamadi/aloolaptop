import { Types } from 'mongoose';
import slugify from 'slugify';

export const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

export const makeSlug = (name: string, provided?: string) => {
  const base = provided?.trim() || name;
  return slugify(base, { lower: true, strict: true });
};

export const parseAttributes = (maybe: any) => {
  if (!maybe) return [];

  if (Array.isArray(maybe)) {
    return maybe.map((item) => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }
      return item;
    });
  }

  if (typeof maybe === 'string') {
    try {
      return JSON.parse(maybe);
    } catch {
      return [];
    }
  }

  return [];
};

export function extractFilters<T extends Record<string, any>>(filterDto: T) {
  // page & limit را جدا می‌کنیم
  const { page, limit, ...rest } = filterDto;

  // حذف فیلدهای غیرمعتبر
  const filter: Record<string, any> = {};
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filter[key] = value;
    }
  });

  return {
    paginationDto: {
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    },
    filter,
  };
}

export function convertToEnglishNumbers(input: any): any {
  if (input == null) return input;

  // اگر ورودی شیء یا آرایه باشد، بازگشتی انجام می‌دهیم
  if (typeof input === 'object') {
    Object.keys(input).forEach((key) => {
      input[key] = convertToEnglishNumbers(input[key]);
    });
    return input;
  }

  if (typeof input !== 'string') return input;

  const persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  const arabicNumbers = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];

  let result = input;

  persianNumbers.forEach((regex, index) => {
    result = result.replace(regex, String(index));
  });

  arabicNumbers.forEach((regex, index) => {
    result = result.replace(regex, String(index));
  });

  return result;
}
