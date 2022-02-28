const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/:table_id/seat")
    .put(controller.seat)
    .delete(controller.unseat)
    .all(methodNotAllowed);

router
    .route("/")
    .get(controller.list)
    .post(controller.post)
    .all(methodNotAllowed);

module.exports = router;