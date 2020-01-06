import bodyParser from "body-parser";
import express from "express";
import path from "path";
import fileUpload from "express-fileupload";
import { ApplicationError } from "./lib/errors";
import {
  verify as verifySessionMiddleware,
  accessPermission as accessPermissionMiddleware
} from "./routes/sessions";

import {
  signup,
  login,
  verifyUser,
  getAllUsers,
  get as getUserRoute,
  update as updateUserRoute,
  forgotPassword as forgotPasswordRoute,
  remove as removeUserRoute,
  create as createUserRoute
} from "./routes/users";

import {
  create as createRoleSRoute,
  getAllRoles as getAllRolesRoute,
  update as updateRoleRoute,
  remove as removeRoleRoute,
  getRolesById,
  getRoleTypes as userTypes
} from "./routes/roles";

export default function createRouter() {
  const router = express.Router();
  // static assets, served from "/public" on the web
  router.use("/public", express.static(path.join(__dirname, "..", "public")));
  router.use(bodyParser.json()); // parse json bodies automatically
  router.use(fileUpload());
  /**
   * Uncached routes:
   * All routes that shouldn't be cached (i.e. non-static assets)
   * should have these headers to prevent 304 Unmodified cache
   * returns. This middleware applies it to all subsequently
   * defined routes.
   */
  router.get("/*", (req, res, next) => {
    res.set({
      "Last-Modified": new Date().toUTCString(),
      Expires: -1,
      "Cache-Control": "must-revalidate, private"
    });
    next();
  });

  // *****************
  // * API ENDPOINTS *
  // *****************
  // authenticate. Returns a json web token to use with requests.
  router.post("/signup", signup);
  router.post("/login", login);
  router.post("/verify", verifyUser);
  router.get(
    "/user/:userId",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    getUserRoute
  );
  router.put(
    "/user",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    updateUserRoute
  );
  router.post("/forgotpassword", forgotPasswordRoute);
  router.delete(
    "/user/:userId",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    removeUserRoute
  );
  router.post(
    "/user",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    createUserRoute
  );

  router.get(
    "/users",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    getAllUsers
  );

  router.post(
    "/role",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    createRoleSRoute
  );

  router.get(
    "/roles",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    getAllRolesRoute
  );

  router.put(
    "/role",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    updateRoleRoute
  );

  router.delete(
    "/role/:roleId",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    removeRoleRoute
  );

  router.get(
    "/userroles/:userId",
    verifySessionMiddleware,
    accessPermissionMiddleware,
    getRolesById
  );

  router.get("/userTypes", verifySessionMiddleware, userTypes);

  // ******************
  // * ERROR HANDLING *
  // ******************
  // 404 route
  router.all("/*", (req, res, next) => {
    next(new ApplicationError("Not Found", 404));
  });
  // catch all ApplicationErrors, then output proper error responses.
  router.use((err, req, res, next) => {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).send({
        message: err.message,
        statusCode: err.statusCode,
        data: err.data || {}
      });
      return;
    }
    res.status(500).send({
      message: "Uncaught error",
      statusCode: 500
    }); // uncaught exception
  });

  // *******************
  // * CATCH ALL ROUTE *
  // *******************
  return router;
}
