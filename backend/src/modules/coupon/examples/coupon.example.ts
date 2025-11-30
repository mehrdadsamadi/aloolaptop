export const EXAMPLE_COUPON = {
  _id: '652f1b4d2f1c9a6a7e9b1234', // ObjectId
  code: 'DISCOUNT20',
  type: 'PRODUCT', // یا 'CART'
  method: 'PERCENT', // یا 'AMOUNT'
  value: 20, // درصد یا مبلغ
  productIds: ['652f1a8c2f1c9a6a7e9b1231', '652f1a9e2f1c9a6a7e9b1232'], // اگر نوع PRODUCT باشد
  minOrderAmount: null, // اگر نوع CART باشد، مقدار حداقل سفارش
  maxUses: 100,
  startDate: '2025-11-30T10:00:00.000Z',
  endDate: '2025-12-31T23:59:59.000Z',
  createdAt: '2025-11-30T09:50:00.000Z',
  updatedAt: '2025-11-30T09:50:00.000Z',
};

export const EXAMPLE_COUPON_CART = {
  _id: '652f1c5d2f1c9a6a7e9b5678',
  code: 'FREESHIP50',
  type: 'CART',
  method: 'AMOUNT', // یا PERCENT
  value: 50, // تخفیف به مبلغ 50 واحد
  productIds: null, // برای نوع CART خالی است
  minOrderAmount: 200, // حداقل مبلغ سفارش
  maxUses: 50,
  startDate: '2025-11-30T10:00:00.000Z',
  endDate: '2025-12-15T23:59:59.000Z',
  createdAt: '2025-11-30T09:55:00.000Z',
  updatedAt: '2025-11-30T09:55:00.000Z',
};
