const express = require("express");
const router = express.Router();

// Controllers
const familyGroupController = require("../controllers/familyGroupController");

// send each request to corresponding controller function
router.route("/createFamilyGroup").post(familyGroupController.createFamilyGroup);
router.route("/getFamilyGroup").get(familyGroupController.getFamilyGroup);
router.route("/getFamilyGroup").post(familyGroupController.getFamilyGroup);
router.route("/addMemberToFamilyGroup").post(familyGroupController.addMemberToFamilyGroup);
router.route("/getFamilyGroupEvents").post(familyGroupController.getFamilyGroupEvents);
router.route("/leaveFamilyGroup").post(familyGroupController.leaveFamilyGroup);
module.exports = router;
