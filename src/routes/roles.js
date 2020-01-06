import { route, successRoute } from "./";
import RoleModel from "../db/RoleModel";
import { ApplicationError } from "../lib/errors";

const roleModel = new RoleModel();

export const create = route(
  async (req, res) => {
    try {
      const roleDetails = await roleModel.create(req.body);
      res.send(successRoute(roleDetails));
    } catch (error) {
      throw error;
    }
  },
  {
    requiredFields: ["role", "userManagement", "editRoles"]
  }
);

export const getAllRoles = route(async (req, res) => {
  try {
    const roleDetails = await roleModel.getAllRoles(req.query.search);
    res.send(successRoute(roleDetails));
  } catch (error) {
    throw error;
  }
});

export const update = route(async (req, res) => {
  try {
    const roleDetails = await roleModel.update(req.body);
    res.send(successRoute(roleDetails));
  } catch (error) {
    throw error;
  }
});

export const remove = route(async (req, res) => {
  try {
    const roleDetails = await roleModel.remove(req.params.roleId);
    res.send(successRoute(roleDetails));
  } catch (error) {
    throw error;
  }
});

export const getRolesById = route(async (req, res) => {
  try {
    const userRoles = await roleModel.getRolesById(req.params.userId);
    res.send(successRoute(userRoles));
  } catch (error) {
    throw error;
  }
});

export const getRoleTypes = route(async (req, res) => {
  try {
    const roleTypes = await roleModel.getRoleTypes();
    res.send(successRoute(roleTypes));
  } catch (error) {
    throw error;
  }
});
