declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    URL: string;
    FRONTEND_URL: string;
    MONGO_URI: string;
    MONGO_DB_NAME: string;
  }
}
