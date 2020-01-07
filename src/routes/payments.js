import { route, successRoute } from "./";
import { ERROR_TEXTS, ERROR_CODES } from "../lib/constants";
import { ApplicationError } from "../lib/errors";
import PaymentModel from "../db/PaymentModel";
const paymentModel = new PaymentModel();

export const splitExpenses = route(async (req, res) => {
  try {
    const orders = await paymentModel.splitExpenses(req.body);
    res.send(successRoute(orders));
  } catch (error) {
    throw error;
  }
});

export const getUserExpenses = route(async (req, res) => {
  try {
    const orders = await paymentModel.getUserExpenses(req.params.emailId);
    res.send(successRoute(orders));
  } catch (error) {
    throw error;
  }
});
