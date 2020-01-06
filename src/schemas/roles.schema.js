import BaseModel from "../db/BaseModel";
import Sequelize from "sequelize";
import { INACTIVE, ACTIVE } from "../lib/constants";

export class RolesSchema extends BaseModel {
  constructor(connection) {
    super(connection);
  }
  Roles = () => {
    const roles = this.connection.define(
      "roles",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        role: {
          type: Sequelize.ENUM("ADMIN", "CUSTOMER", "MANAGER"),
          defaultValue: "CUSTOMER",
          allowNull: false
        },
        userManagement: { type: Sequelize.JSON, allowNull: false },
        editRoles: { type: Sequelize.JSON, allowNull: false }
      },
      {
        charset: "utf8mb4",
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "roles"
      }
    );
    return roles;
  };
}
export default new RolesSchema();
