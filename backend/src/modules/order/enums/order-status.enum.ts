export enum OrderStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  REFUNDED = 'refunded', // بازگشت مبلغ به کاربر
}
