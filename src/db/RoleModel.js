import BaseModel from "./BaseModel";
import rolesSchema from "../schemas/roles.schema";
import {
  ACTIVE,
  ERROR_CODES,
  ERROR_TEXTS,
  SUCCESS_TEXT
} from "../lib/constants";
import UserModel from "./UserModel";
import { ApplicationError } from "../lib/errors";
const userModel = new UserModel();
import Sequelize from "sequelize";
const Op = Sequelize.Op;

export default class RoleModel extends BaseModel {
  constructor(connection) {
    super("roles", connection);
    this.schema = rolesSchema.Roles();
    this.name = "roles";
    this.db = this.connection;
    this.model = this.connection.model(this.name, this.schema);
  }

  async create(roleDetails) {
    try {
      const findRole = await this.model.findOne({
        where: { role: roleDetails.role }
      });
      if (findRole) {
        throw new ApplicationError(
          `${roleDetails.name}, ${ERROR_TEXTS.ROLE_ALREADY_EXIST}`,
          ERROR_CODES.BAD_REQUEST
        );
      }
      const roleInformation = await this.model.create(roleDetails);
      return roleInformation;
    } catch (error) {
      throw error;
    }
  }

  async getAllRoles(search) {
    try {
      let whereCondition = {};
      if (search) {
        whereCondition = { role: { [Op.like]: `%${search}%` } };
      }
      const userRoles = await this.model.findAll({
        where: whereCondition
      });
      return userRoles;
    } catch (error) {
      throw error;
    }
  }

  async verifyAccessPermission(userId, { parentModule, subModule }) {
    try {
      const userDetails = await userModel.getUserType(userId);
      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.FORBIDDEN
        );
      }
      const whereCondition = {
        role: userDetails.userType
      };
      whereCondition[Op.and] = Sequelize.fn(
        "JSON_CONTAINS",
        Sequelize.col(`${parentModule}`),
        Sequelize.cast(`{"${subModule}": true}`, "CHAR CHARACTER SET utf8")
      );
      const accessPermission = await this.model.findOne({
        where: whereCondition
      });
      return accessPermission ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async update(roleInformation) {
    try {
      await this.model.update(roleInformation, {
        where: { role: roleInformation.userType }
      });
      delete roleInformation.loggedInUserId;
      return roleInformation;
    } catch (error) {
      throw error;
    }
  }

  async remove(roleId) {
    try {
      const removalInfo = await this.model.destroy({
        where: { id: roleId }
      });
      if (!removalInfo) {
        throw new ApplicationError(
          ERROR_TEXTS.ROLE_NOT_FOUND,
          ERROR_CODES.FORBIDDEN
        );
      }
      return SUCCESS_TEXT.ROLE_REMOVED;
    } catch (error) {
      throw error;
    }
  }

  async getRolesById(userId) {
    try {
      let userDetails = await userModel.getUserType(userId);
      if (!userDetails) {
        throw new ApplicationError(
          ERROR_TEXTS.INVALID_USER,
          ERROR_CODES.FORBIDDEN
        );
      }
      const userRoles = await this.model.findOne({
        role: userDetails.userType
      });
      return userRoles;
    } catch (error) {
      throw error;
    }
  }

  async getRoleTypes() {
    try {
      let roleTypes = await this.model.findAll();
      roleTypes = roleTypes.map(roleDetail => roleDetail.role);
      return roleTypes;
    } catch (error) {
      throw error;
    }
  }
}
