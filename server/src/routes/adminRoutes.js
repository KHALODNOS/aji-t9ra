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
router.get("/stats", adminController.getDashboardStats);
router.get("/support-requests", adminController.getSupportRequests);
router.put("/support-requests/:id/status", adminController.updateSupportRequestStatus);

// Content Review Routes
router.get("/pending-content", adminController.getPendingContent);
router.put("/approve-content/:contentId", adminController.approveContent);
router.delete("/reject-content/:contentId", adminController.rejectContent);
router.post("/bulk-approve-content", adminController.bulkApproveContent);
router.post("/bulk-reject-content", adminController.bulkRejectContent);

module.exports = router;
