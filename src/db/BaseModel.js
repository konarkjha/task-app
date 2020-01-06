import { ENVIRONMENT } from "../lib/constants";
import { config } from "../lib/config";
import Sequelize from "sequelize";

const sequelize = new Sequelize(
  config[ENVIRONMENT].MYSQL_SETTINGS.DATABASE,
  config[ENVIRONMENT].MYSQL_SETTINGS.USER,
  config[ENVIRONMENT].MYSQL_SETTINGS.PASSWORD,
  {
    host: config[ENVIRONMENT].MYSQL_SETTINGS.HOST,
    port: config[ENVIRONMENT].MYSQL_SETTINGS.PORT,
    dialect: config[ENVIRONMENT].MYSQL_SETTINGS.DIALECT,
    logging: true,
    pool: {
      max: 10,
      idle: 10000
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(error => {
    console.error("Unable to connect to the database:", error);
  });

export default class BaseModel {
  constructor(name, connection) {
    this.name = name;
    if (sequelize) {
      this.connection = sequelize;
    }
  }
  async _getModel() {
    this.model = await this.connection.model(this.name, this.schema);
  }
}
