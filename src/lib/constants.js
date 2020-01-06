import { getEnv } from "../lib/env";
export const ENVIRONMENT = getEnv("NODE_ENV");
export const MASTER = "master";
export const DEVELOPMENT = "development";
export const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409
};
export const ERROR_TEXTS = {
  SIGNUP_SUCCESS: "Signup successful.",
  USER_ALREADY_EXIST: "Phone number and Email Id should be unique.",
  MISSING_LOGIN_CREDENTIALS: "Please provide valid credintials.",
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_USER_DETAILS:
    "Please provide valid email or contact number to reset password.",
  FORBIDDEN: "This is forbidden.",
  INVALID_USER: "Invalid user.",
  USER_EXIST: "Phone number and Email Id should be unique.",
  NOT_AUTHORIZED: "Not authorized!!!.",
  NOT_FOUND: "Not found.",
  USER_NOT_FOUND: "User not found.",
  EMAIL_NOT_FOUND: "Email not found.",
  TOKEN_NOT_VERIFIED: "Could not verify token.",
  MISSING_AUTH_TOKEN: "Missing Authorization header with Bearer token",
  ROLE_ALREADY_EXIST: ", already exists.",
  ROLE_NOT_FOUND: "Incorrect role id.",
  PASSWORD_FIELD_MISSING: "Please provide valid password",
  RECORD_NOT_FOUND: "No record found.",
  PROVIDE_VALID_CREDENTIALS: "Please provide either emailId or contact number."
};

export const SUCCESS_TEXT = {
  USER_REMOVED: "User details has been removed.",
  ROLE_REMOVED: "Role removed successfully.",
  OTP_SENT: "OTP sent successfully"
};

export const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1
};
export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const USER_ROLES = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER"
};
export const MODULES = {
  EDIT_ROLES: "editRoles",
  ROLE_EDIT: "Edit"
};
export const ACCESS_ROLES = {
  POST_ROLE: { parentModule: "editRoles", subModule: "Add" },
  GET_USERROLES: { parentModule: "editRoles", subModule: "View" },
  GET_ROLES: { parentModule: "editRoles", subModule: "View" },
  PUT_ROLE: { parentModule: "editRoles", subModule: "Edit" },
  DELETE_ROLE: { parentModule: "editRoles", subModule: "Delete" },
  POST_USER: { parentModule: "userManagement", subModule: "Add" },
  GET_USERS: { parentModule: "userManagement", subModule: "View" },
  GET_USER: { parentModule: "userManagement", subModule: "View" },
  PUT_USER: { parentModule: "userManagement", subModule: "Edit" },
  DELETE_USER: { parentModule: "userManagement", subModule: "Delete" }
};
export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  PAGE: 1
};
export const EMAIL_SUBJECTS = {
  VERIFY_EMAIL: "Verification email",
  RESET_PASSWORD_EMAIL: "Getbaqla: Reset password",
  USER_CREATED: "Welcome To Getbaqala"
};
export const USER_STATUS = {
  VERIFIED: "VERIFIED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION"
};
