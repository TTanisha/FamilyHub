const express = require("express");
const router = express.Router();

// Controllers
const familyGroupController = require("../controllers/familyGroupController");

// send each request to corresponding controller function
router.route("/createFamilyGroup").post(familyGroupController.createFamilyGroup);
router.route("/getFamilyGroup").get(familyGroupController.getFamilyGroup);

module.exports = router;
