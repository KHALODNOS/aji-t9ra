const express = require("express");
const router = express.Router();

// مسار تجريبي للتأكد أن السيرفر مستعد للربط مستقبلاً
router.get("/status", (req, res) => {
    res.json({ message: "Agora Backend Service is Ready!" });
});

module.exports = router;