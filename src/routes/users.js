import { route, successRoute } from "./";
import UserModel from "../db/UserModel";
import { ApplicationError } from "../lib/errors";
import { ERROR_CODES, PAGINATION_LIMITS, ERROR_TEXTS } from "../lib/constants";

const userModel = new UserModel();

export const signup = route(
  async (req, res) => {
    try {
      const userDetails = await userModel.signup(req.body);
      res.send(successRoute(userDetails));
    } catch (error) {
      throw error;
    }
  },
  {
    requiredFields: ["name", "password", "email", "contactNumber"]
  }
);

export const login = route(async (req, res) => {
  try {
    const { email, contactNumber, password } = req.body;
    if ((!contactNumber && !password) || (!email && !password)) {
      throw new ApplicationError(
        MISSING_LOGIN_CREDENTIALS,
        ERROR_CODES.BAD_REQUEST
      );
    }
    const userDetails = await userModel.login(req.body);
    res.send(successRoute(userDetails));
  } catch (error) {
    throw error;
  }
});

export const getAllUsers = route(async (req, res) => {
  try {
    let filterOptions = {};
    filterOptions.userType = req.query.userType || null;
    const usersList = await userModel.getAllUsers(
      parseInt(req.query.page) || PAGINATION_LIMITS.PAGE,
      parseInt(req.query.limit) || PAGINATION_LIMITS.DEFAULT,
      req.query.search || null,
      filterOptions
    );
    res.send(successRoute(usersList));
  } catch (error) {
    throw error;
  }
});

export const get = route(async (req, res) => {
  try {
    const userDetails = await userModel.get(req.params.userId);
    res.send(successRoute(userDetails));
  } catch (error) {
    throw error;
  }
});

export const update = route(
  async (req, res) => {
    try {
      let profilePic = null;
      if (req.files) {
        profilePic = req.files.userProfileImage;
      }
      const updateUserDetails = await userModel.update(req.body, profilePic);
      res.send(successRoute(updateUserDetails));
    } catch (error) {
      throw error;
    }
  },
  { requiredFields: ["userId"] }
);

export const remove = route(async (req, res) => {
  try {
    const removalInformation = await userModel.remove(req.params.userId);
    res.send(successRoute(removalInformation));
  } catch (error) {
    throw error;
  }
});

export const forgotPassword = route(async (req, res) => {
  try {
    const { email, contactNumber } = req.body;
    if (!email && !contactNumber) {
      throw new ApplicationError(
        ERROR_TEXTS.INVALID_USER_DETAILS,
        ERROR_CODES.BAD_REQUEST
      );
    }
    const userDetails = await userModel.loginWithOtp(req.body, true);
    res.send(successRoute(userDetails));
  } catch (error) {
    throw error;
  }
});

export const create = route(
  async (req, res) => {
    try {
      const userDetails = await userModel.create(req.body);
      res.send(successRoute(userDetails));
    } catch (error) {
      throw error;
    }
  },
  {
    requiredFields: ["name", "email", "contactNumber", "userType"]
  }
);
