import appRoot from "app-root-path";
import { config as loadENVs } from "dotenv";
loadENVs();

export const config = {
  master: {
    MYSQL_SETTINGS: {
      HOST: process.env.MASTER_DB_HOST,
      DATABASE: process.env.MASTER_DATABASE,
      USER: process.env.MASTER_USER,
      PASSWORD: process.env.MASTER_PASSWORD,
      PORT: process.env.MASTER_PORT,
      DIALECT: process.env.MASTER_DIALECT
    },
    HOST: "task-db.cjhrsjrrdcaq.ap-south-1.rds.amazonaws.com",
    FILE_PATHS: {
      UPLOAD_PROFILE_IMAGE_PATH: `${appRoot}/public/uploads/profileImage`,
      PROFILE_IMAGE_PATH: `http://localhost:3000/public/uploads/profileImage`
    }
  },
  development: {
    MYSQL_SETTINGS: {
      HOST: process.env.DEV_DB_HOST,
      DATABASE: process.env.DEV_DATABASE,
      USER: process.env.DEV_USER,
      PASSWORD: process.env.DEV_PASSWORD,
      PORT: process.env.DEV_PORT,
      DIALECT: process.env.DEV_DIALECT
    },
    HOST: "http://localhost:3000",
    FILE_PATHS: {
      UPLOAD_PROFILE_IMAGE_PATH: `${appRoot}/public/uploads/profileImage`,
      PROFILE_IMAGE_PATH: `http://localhost:3000/public/uploads/profileImage`
    }
  }
};
