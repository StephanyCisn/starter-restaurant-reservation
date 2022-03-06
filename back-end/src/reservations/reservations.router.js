/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

 const router = require("express").Router();
 const controller = require("./reservations.controller");
 const methodNotAllowed = require("../errors/methodNotAllowed");
 
 router
     .route("/:reservation_Id/status")
     .put(controller.updateStatus)
     .all(methodNotAllowed);
 
 router
     .route("/:reservation_Id")
     .get(controller.read)
     .put(controller.put)
     .all(methodNotAllowed);
 
 
 router
     .route("/")
     .get(controller.list)
     .post(controller.post)
     .all(methodNotAllowed);
 
 module.exports = router;
 