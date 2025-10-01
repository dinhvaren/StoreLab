const express = require("express");
const router = express.Router();
const { AdminController } = require("../app/controllers/index");
const { auth, isAdmin } = require("../app/middlewares/auth");

router.get("/users", auth, isAdmin, AdminController.listUsers);
router.get("/users/:id", auth, isAdmin, AdminController.getUser);
router.post("/users", auth, isAdmin, AdminController.createUser);
router.put("/users/:id", auth, isAdmin, AdminController.updateUser);
router.delete("/users/:id", auth, isAdmin, AdminController.deleteUser);

module.exports = router;
