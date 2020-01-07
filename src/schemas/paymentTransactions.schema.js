import BaseModel from "../db/BaseModel";
import Sequelize from "sequelize";
import { PAYMENT_STATUS } from "../lib/constants";
export class PaymentTransactionsSchema extends BaseModel {
  constructor(connection) {
    super(connection);
  }
  PaymentTransactions = () => {
    const paymentTransactions = this.connection.define(
      "paymenttransactions",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        paymentId: Sequelize.INTEGER,
        amountPaid: Sequelize.DECIMAL,
        paymentDate: Sequelize.DATE,
        paymentDetails: Sequelize.JSON,
        status: {
          type: Sequelize.INTEGER,
          defaultValue: PAYMENT_STATUS.PENDING
        }
      },
      {
        charset: "utf8mb4",
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: "paymenttransactions"
      }
    );
    return paymentTransactions;
  };
}
export default new PaymentTransactionsSchema();
