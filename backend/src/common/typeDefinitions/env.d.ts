declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    URL: string;
    FRONTEND_URL: string;

    MONGO_URI: string;
    MONGO_DB_NAME: string;

    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;

    SMS_API_KEY: string;
    SMS_TEMPLATE_ID: string;

    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT: string;

    ZARINPAL_PAYMENT_REQUEST: string;
    ZARINPAL_MERCHANT_ID: string;
    ZARINPAL_GATEWAY_URL: string;
    ZARINPAL_VERIFY_PAYMENT_URL: string;
    GATEWAY_CALLBACK_ENDPOINT: string;
  }
}
