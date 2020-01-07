import BaseModel from "./BaseModel";
import UsersSchema from "../schemas/user.schema";
import PaymentSchema from "../schemas/payments.schema";
import PaymentTransactionSchema from "../schemas/paymentTransactions.schema";
import { ApplicationError } from "../lib/errors";
import { ERROR_CODES, ERROR_TEXTS, USER_STATUS } from "../lib/constants";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

export default class PaymentModel extends BaseModel {
  constructor(connection) {
    super("payments", connection);
    this.schema = PaymentSchema.Payments();
    this.name = "payments";
    this.db = this.connection;
    this.model = this.connection.model(this.name, this.schema);
    this.usersSchema = UsersSchema.Users();
    this.userModel = this.connection.model("users", this.usersSchema);
    this.paymentTransactionsSchema = PaymentTransactionSchema.PaymentTransactions();
    this.paymentTransactionsModel = this.connection.model(
      "paymenttransactions",
      this.paymentTransactionsSchema
    );
  }
  async splitExpenses(paymentDetails) {
    try {
      let splittedAmount = 0;
      let totalPercentage = 0;
      const userList = paymentDetails.userDetails.map(user => {
        if (paymentDetails.ratioType === "PERCENT") {
          totalPercentage += user.percentage;
        }
        if (totalPercentage > 100) {
          throw new ApplicationError(
            ERROR_TEXTS.INCORRECT_PERCENTAGE,
            ERROR_CODES.BAD_REQUEST
          );
        }
        return user.userId;
      });
      const userRegistered = await this.userModel.findAll({
        attributes: [["id", "userId"], "email"],
        where: { id: { [Op.in]: userList }, status: USER_STATUS.VERIFIED },
        raw: true
      });
      if (userRegistered.length !== paymentDetails.userDetails.length) {
        throw new ApplicationError(
          "SOME USERS ARE NOT REGISTERED",
          ERROR_CODES.BAD_REQUEST
        );
      }
      if (paymentDetails.ratioType === "EQUAL") {
        splittedAmount =
          parseFloat(paymentDetails.amount) / paymentDetails.userDetails.length;
        paymentDetails.userDetails.map(async user => {
          const totalAmount = parseFloat(paymentDetails.amount);
          let amountPaid = 0;
          let amountToBeReceived = 0;
          if (paymentDetails.paidBy === user.userId) {
            amountPaid = totalAmount;
            amountToBeReceived = totalAmount - splittedAmount;
          }
          const paymentObject = {
            userId: user.userId,
            paidBy: paymentDetails.paidBy,
            payingFor: paymentDetails.payingFor,
            totalAmount: totalAmount,
            amountToPay: splittedAmount,
            amountPaid: amountPaid,
            amountToBeReceived: amountToBeReceived,
            ratioType: paymentDetails.ratioType
          };
          await this.model.create(paymentObject);
        });
      } else {
        paymentDetails.userDetails.map(async user => {
          let amountPaid = 0;
          let amountToBeReceived = 0;
          const percent = parseFloat(user.percentage);
          const totalAmount = parseFloat(paymentDetails.amount);
          splittedAmount = (percent / 100) * totalAmount;
          if (paymentDetails.paidBy === user.userId) {
            amountPaid = totalAmount;
            amountToBeReceived = totalAmount - splittedAmount;
          }
          const paymentObject = {
            userId: user.userId,
            paidBy: paymentDetails.paidBy,
            payingFor: paymentDetails.payingFor,
            percentage: user.percentage,
            totalAmount: totalAmount,
            amountToPay: splittedAmount,
            amountPaid: amountPaid,
            amountToBeReceived: amountToBeReceived,
            ratioType: paymentDetails.ratioType
          };
          await this.model.create(paymentObject);
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserExpenses(userId) {
    try {
      this.model.belongsTo(this.userModel, {
        foreignKey: "userId",
        targetKey: "id"
      });
      const expenses = await this.model.findAll({
        attributes: {
          exclude: ["updatedAt", "deletedAt"]
        },
        include: [
          {
            model: this.userModel,
            attributes: [["id", "userId"], "email", "contactNumber"]
          }
        ],
        where: { paidBy: userId }
      });
      return expenses;
    } catch (error) {
      throw error;
    }
  }
}
