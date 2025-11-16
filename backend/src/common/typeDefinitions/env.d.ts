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
  }
}
