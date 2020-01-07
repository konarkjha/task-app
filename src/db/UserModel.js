import BaseModel from "./BaseModel";
// eslint-disable-next-line import/no-named-as-default
import UserSchema from "../schemas/user.schema";
import { ApplicationError } from "../lib/errors";
import {
  ERROR_CODES,
  ERROR_TEXTS,
  SUCCESS_TEXT,
  ENVIRONMENT,
  EMAIL_SUBJECTS,
  USER_STATUS
} from "../lib/constants";
import { generateToken } from "../lib/token";
import { hashPassword, comparePassword } from "../lib/crypto";
import uuid from "uuid";
import Sequelize from "sequelize";
import { config } from "../lib/config";
import { sendSms, sendMail } from "../lib/utils";
import ejs from "ejs";
const Op = Sequelize.Op;

export default class UserModel extends BaseModel {
  constructor(connection) {
    super("users", connection);
    this.schema = UserSchema.Users();
    this.name = "users";
    this.db = this.connection;
    this.model = this.connection.model(this.name, this.schema);
  }

  async signup(signupDetails) {
    try {
      const userExist = await this.model.findOne({
        where: {
          [Op.or]: [
            { email: signupDetails.email },
            { contactNumber: signupDetails.contactNumber }
          ]
        }
      });
      if (userExist) {
        throw new ApplicationError(
          ERROR_TEXTS.USER_ALREADY_EXIST,
          ERROR_CODES.CONFLICT
        );
      }
      const verificationCode = Math.floor(Math.random() * 8999 + 1000);
      signupDetails.verificationCode = verificationCode;
      const userId = uuid();
      signupDetails.id = userId;
      signupDetails.password = await hashPassword(signupDetails.password);
      await this.model.create(signupDetails);
      const emailBody = await ejs.renderFile(
        "templates/email/signupOtpVerification.ejs",
        {
          name: signupDetails.name,
          verificationCode: verificationCode
          // GetbaqalaLogo: "path"
        }
      );
      sendMail(signupDetails.email, EMAIL_SUBJECTS.VERIFY_EMAIL, emailBody);
      const message = `Hi ${signupDetails.name},%0AWelcome to Getbaqala. Your OTP is ${verificationCode}. Enter this in the app to verify your account.`;
      sendSms(signupDetails.contactNumber, message);
      return {
        userId: userId
      };
    } catch (error) {
      throw error;
    }
  }

  verify = async (userId, verificationCode, firstTimeLogin = null) => {
    try {
      let whereCondition = {
        id: userId,
        verificationCode
      };
      if (!firstTimeLogin) {
        whereCondition.status = USER_STATUS.VERIFIED;
      } else {
        whereCondition.status = USER_STATUS.PENDING_VERIFICATION;
      }
      const userDetails = await this.model.findOne({
        attributes: ["id", "name", "email", "contactNumber", "userType"],
        where: whereCondition,
        raw: true
      });
      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.RECORD_NOT_FOUND,
          ERROR_CODES.FORBIDDEN
        );
      }
      await this.model.update(
        {
          verificationCode: null,
          lastLogin: new Date(),
          status: USER_STATUS.VERIFIED
        },
        { where: { id: userId } }
      );
      const token = await generateToken(userId);
      userDetails.token = token;
      return userDetails;
    } catch (error) {
      throw error;
    }
  };

  async loginWithOtp(passedUserInformation, forgetPassword = false) {
    try {
      const verificationCode = Math.floor(Math.random() * 8999 + 1000);
      let whereCondition = {};
      if (passedUserInformation.contactNumber) {
        whereCondition.contactNumber = passedUserInformation.contactNumber;
      } else {
        whereCondition.email = passedUserInformation.email;
      }
      const userDetails = await this.model.findOne({
        attributes: [
          "id",
          "name",
          "password",
          "email",
          "contactNumber",
          "userType"
        ],
        where: whereCondition,
        raw: true
      });
      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER_DETAILS,
          ERROR_CODES.NOT_AUTHORIZED
        );
      }
      await this.model.update(
        {
          verificationCode
        },
        {
          where: {
            id: userDetails.id
          }
        }
      );
      let emailSubject = EMAIL_SUBJECTS.VERIFY_EMAIL;
      let message = `Hi ${userDetails.name},%0AWelcome to Getbaqala_Task. Your OTP is ${verificationCode}. Enter this in the app to verify your account.`;
      let emailBody = await ejs.renderFile(
        "templates/email/signupOtpVerification.ejs",
        {
          name: userDetails.name,
          verificationCode
          // BaqalaLogo: "path"
        }
      );
      if (forgetPassword) {
        emailSubject = EMAIL_SUBJECTS.RESET_PASSWORD_EMAIL;
        message = `Hi ${userDetails.name},%0AWelcome to Getbaqala_Task. Your OTP for reset password is ${verificationCode}. Enter this to verify your authenticity.`;
        emailBody = await ejs.renderFile("templates/email/forgotPassword.ejs", {
          name: userDetails.name,
          verificationCode
          // BaqalaLogo: "path"
        });
      }
      if (passedUserInformation.contactNumber) {
        sendSms(passedUserInformation.contactNumber, message);
      }
      if (passedUserInformation.email) {
        sendMail(passedUserInformation.email, emailSubject, emailBody);
      }
      return { userId: userDetails.id };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDetails) {
    try {
      if (!loginDetails.contactNumber && !loginDetails.email) {
        throw new ApplicationError(
          ERROR_TEXTS.PROVIDE_VALID_CREDENTIALS,
          ERROR_CODES.BAD_REQUEST
        );
      }
      if (loginDetails.loginWithOtp) {
        const passedUserInformation = {
          contactNumber: loginDetails.contactNumber,
          email: loginDetails.email
        };
        const userDetails = await this.loginWithOtp(passedUserInformation);
        return {
          userId: userDetails.userId,
          successMessage: SUCCESS_TEXT.OTP_SENT
        };
      } else {
        const userInfo = await this.loginWithUserName(loginDetails);
        userInfo.token = await generateToken(userInfo.id);
        return userInfo;
      }
    } catch (error) {
      throw error;
    }
  }

  async loginWithUserName(loginDetails) {
    try {
      const whereCondition = {
        status: USER_STATUS.VERIFIED
      };
      if (loginDetails.email) {
        whereCondition.email = loginDetails.email;
      } else {
        whereCondition.contactNumber = loginDetails.contactNumber;
      }
      const userDetails = await this.model.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt", "status"]
        },
        where: whereCondition,
        raw: true
      });
      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_CREDENTIALS,
          ERROR_CODES.NOT_AUTHORIZED
        );
      }
      const verifyPassword = await comparePassword(
        loginDetails.password,
        userDetails.password
      );
      if (!verifyPassword) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_CREDENTIALS,
          ERROR_CODES.NOT_AUTHORIZED
        );
      }
      await this.model.update(
        {
          lastLogin: new Date()
        },
        {
          where: {
            id: userDetails.id
          }
        }
      );
      delete userDetails.password;
      return userDetails;
    } catch (error) {
      throw error;
    }
  }

  async get(userId) {
    try {
      const userDetails = await this.model.findOne({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "deletedAt"]
        },
        where: {
          id: userId
        },
        raw: true
      });

      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.BAD_REQUEST
        );
      }
      return userDetails;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(page, limit, search, filterOptions) {
    try {
      const whereCondition = {};
      if (search) {
        whereCondition[Op.and] = {
          [Op.or]: [
            {
              $name$: {
                [Op.like]: `%${search}%`
              }
            },
            {
              $email$: {
                [Op.like]: `%${search}%`
              }
            },
            {
              $contactNumber$: {
                [Op.like]: `%${search}%`
              }
            },
            {
              $userType$: {
                [Op.like]: `%${search}%`
              }
            }
          ]
        };
      }
      if (filterOptions.userType) {
        whereCondition.userType = filterOptions.userType;
      }
      const pageNumber = page;
      const offsetLimit = (pageNumber - 1) * limit;
      const userDetails = await this.model.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "deletedAt"]
        },
        where: whereCondition,
        offset: offsetLimit,
        limit,
        raw: true
      });

      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.BAD_REQUEST
        );
      }
      return userDetails;
    } catch (error) {
      throw error;
    }
  }

  async update(passedUserInformation, photoUrl) {
    try {
      delete passedUserInformation.loggedInUserId;
      if (passedUserInformation.password) {
        passedUserInformation.password = await hashPassword(
          passedUserInformation.password
        );
      }
      if (photoUrl) {
        const randomImageNumber = Math.floor(Math.random() * 89999 + 10000);
        const filename = photoUrl.name;
        await photoUrl.mv(
          `${config[ENVIRONMENT].FILE_PATHS.UPLOAD_PROFILE_IMAGE_PATH}/${randomImageNumber}${filename}`,
          function(err) {
            if (err) {
              throw err;
            }
          }
        );
        photoUrl = `${config[ENVIRONMENT].FILE_PATHS.PROFILE_IMAGE_PATH}/${randomImageNumber}${filename}`;
        passedUserInformation = { ...passedUserInformation, photoUrl };
      }
      const updatedInformation = await this.model.update(
        passedUserInformation,
        {
          where: { id: passedUserInformation.userId }
        }
      );
      if (!updatedInformation[0]) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.BAD_REQUEST
        );
      }
      delete passedUserInformation.password;
      delete passedUserInformation.forgotPassword;
      return passedUserInformation;
    } catch (error) {
      throw error;
    }
  }

  async remove(id) {
    try {
      const removalInformation = await this.model.destroy({
        where: {
          id
        }
      });
      if (!removalInformation) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.BAD_REQUEST
        );
      }
      return SUCCESS_TEXT.USER_REMOVED;
    } catch (error) {
      throw error;
    }
  }

  async getUserType(userId) {
    try {
      const userDetails = await this.model.findOne({
        attributes: ["id", "userType"],
        where: {
          id: userId
        },
        raw: true
      });

      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.BAD_REQUEST
        );
      }
      return userDetails;
    } catch (error) {
      throw error;
    }
  }

  async create(userDetails) {
    try {
      const userExist = await this.model.findOne({
        where: {
          [Op.or]: [
            { email: userDetails.email },
            { contactNumber: userDetails.contactNumber }
          ]
        }
      });

      if (userExist) {
        throw new ApplicationError(
          ERROR_TEXTS.USER_EXIST,
          ERROR_CODES.CONFLICT
        );
      }
      const userId = uuid();
      userDetails.id = userId;

      if (!userDetails.password) {
        throw new ApplicationError(
          ERROR_TEXTS.PASSWORD_FIELD_MISSING,
          ERROR_CODES.BAD_REQUEST
        );
      }
      userDetails.password = await hashPassword(userDetails.password);
      await this.model.create(userDetails);
      delete userDetails.password;

      return userDetails;
    } catch (error) {
      throw error;
    }
  }
}
