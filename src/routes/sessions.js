import { ApplicationError } from "../lib/errors";
import { decodeToken } from "../lib/token";
import { ERROR_CODES, ERROR_TEXTS, ACCESS_ROLES } from "../lib/constants";
import RoleModel from "../db/RoleModel";

// middleware that verifies that a token is present and is legitimate.
export const verify = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(
      new ApplicationError(
        ERROR_TEXTS.MISSING_AUTH_TOKEN,
        ERROR_CODES.NOT_AUTHORIZED
      )
    );
    return;
  }
  // strip the leading "Bearer " part from the rest of the token string
  const authorizationHeader = authHeader.substring("Bearer ".length);
  const token = authorizationHeader.split(",");
  try {
    const decoded = await decodeToken(token[1]);
    if (token[0] != decoded.id) {
      throw new ApplicationError(ERROR_TEXTS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
    req.body.loggedInUserId = token[0];
    next();
  } catch (err) {
    next(
      new ApplicationError(
        ERROR_TEXTS.TOKEN_NOT_VERIFIED,
        ERROR_CODES.NOT_AUTHORIZED
      )
    );
  }
};

export const accessPermission = async (req, res, next) => {
  try {
    const paramsValues = Object.keys(req.params);
    let getUrl = req.url;
    if (paramsValues.length) {
      paramsValues.forEach(value => {
        getUrl = getUrl.replace(`/${req.params[value]}`, "");
      });
    }
    getUrl = getUrl.replace(new RegExp("/", "g"), "_").split("?")[0];
    const requestPath = `${req.method}${getUrl}`.toUpperCase();
    const roleModel = new RoleModel();
    const accessAllowed = await roleModel.verifyAccessPermission(
      req.body.loggedInUserId,
      ACCESS_ROLES[requestPath]
    );
    if (!accessAllowed) {
      throw new ApplicationError(
        ERROR_TEXTS.NOT_AUTHORIZED,
        ERROR_CODES.NOT_AUTHORIZED
      );
    }
    next();
  } catch (error) {
    next(
      new ApplicationError(
        ERROR_TEXTS.NOT_AUTHORIZED,
        ERROR_CODES.NOT_AUTHORIZED
      )
    );
  }
};
