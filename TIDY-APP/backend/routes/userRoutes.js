const express = require("express");
const router = express.Router();
const {
    createAccount,
    createLogin,
    forgetPassword,
    resetPassword,
    getUser,
    createUser,
    editUserProfile,
}=require("../Controllers/userControllers");
const { authenticationToken } = require("../utilities");

const upload = require('../Middlewares/multerConfig'); // Adjust the path as needed

router.route("/signup").post(createAccount)
router.route("/login").post(createLogin)
router.route("/forgot-password").post(forgetPassword)
router.route("/reset-password").post(resetPassword)
router.route("/addprofile").post(authenticationToken,upload.single('profileImage'),createUser)
router.route("/get-user").get(authenticationToken,getUser)
router.route("/editprofile/:id").put(authenticationToken,upload.single('profileImage'),editUserProfile)

module.exports =router;