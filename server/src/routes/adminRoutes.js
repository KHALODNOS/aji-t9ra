const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes here require admin role
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/pending-teachers", adminController.getPendingTeachers);
router.put("/approve-teacher/:userId", adminController.approveTeacher);
router.delete("/reject-teacher/:userId", adminController.rejectTeacher);

router.get("/users", adminController.getAllUsers);
router.put("/toggle-status/:userId", adminController.toggleUserStatus);

module.exports = router;
