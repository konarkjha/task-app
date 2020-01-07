import BaseModel from "../db/BaseModel";
import Sequelize from "sequelize";
export class PaymentsSchema extends BaseModel {
  constructor(connection) {
    super(connection);
  }
  Payments = () => {
    const payments = this.connection.define(
      "payments",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        userId: Sequelize.STRING,
        paidBy: Sequelize.STRING,
        payingFor: Sequelize.STRING,
        percentage: Sequelize.DECIMAL,
        totalAmount: Sequelize.DECIMAL,
        amountToPay: Sequelize.DECIMAL,
        amountPaid: Sequelize.DECIMAL,
        amountToBeReceived: Sequelize.DECIMAL,
        ratioType: {
          type: Sequelize.ENUM("EQUAL", "PERCENT"),
          defaultValue: "EQUAL"
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1
        }
      },
      {
        charset: "utf8mb4",
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "payments"
      }
    );
    return payments;
  };
}
export default new PaymentsSchema();
