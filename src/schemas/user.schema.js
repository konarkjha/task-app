import BaseModel from "../db/BaseModel";
import Sequelize from "sequelize";
export class UserSchema extends BaseModel {
  constructor(connection) {
    super(connection);
  }
  Users = () => {
    const users = this.connection.define(
      "users",
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        contactNumber: { type: Sequelize.INTEGER, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        userType: {
          type: Sequelize.ENUM("CUSTOMER", "ADMIN", "MANAGER"),
          defaultValue: "CUSTOMER",
          allowNull: false
        },
        photoUrl: {
          type: Sequelize.STRING,
          defaultValue: null
        },
        lastLogin: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: false
        }
      },
      {
        charset: "utf8mb4",
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "users"
      }
    );
    return users;
  };
}
export default new UserSchema();
