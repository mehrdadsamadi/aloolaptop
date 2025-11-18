export const EXAMPLE_PRODUCT = {
  name: 'لپتاپ ایسوس مدل X123',
  slug: 'asus-x123',
  description: 'لپتاپ دست دوم با مشخصات عالی',
  categoryId: '64ff2f4b7a1c3b5d12345678',
  condition: 'used',
  grade: 'A++',
  price: 15000000,
  stock: 5,
  attributes: [
    { key: 'ram', label: 'رم', value: '8GB' },
    { key: 'cpu', label: 'پردازنده', value: 'i5 10th Gen' },
    { key: 'storage', label: 'حافظه', value: '512GB SSD' },
  ],
  images: [
    {
      url: 'https://bucket.s3.region.amazonaws.com/product1.jpg',
      key: 'product1.jpg',
    },
    {
      url: 'https://bucket.s3.region.amazonaws.com/product2.jpg',
      key: 'product2.jpg',
    },
  ],
  isActive: true,
  discountPercent: 10,
  discountExpiresAt: '2025-12-31T23:59:59.000Z',
};
