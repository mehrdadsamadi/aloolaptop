import { Types } from 'mongoose';
import slugify from 'slugify';

export const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

export const makeSlug = (name: string, provided?: string) => {
  const base = provided?.trim() || name;
  return slugify(base, { lower: true, strict: true });
};

export const parseAttributes = (maybe: any) => {
  if (!maybe) return [];

  if (Array.isArray(maybe)) return maybe;

  if (typeof maybe === 'string') {
    try {
      return JSON.parse(maybe);
    } catch {
      return [];
    }
  }

  return [];
};
