const express = require("express");
const router = express.Router();
const{registerAdmin, loginAdmin,getAdminDetails,editAdminProfile,getAllOrders,updateOrderStatus}=require("../Controllers/adminController");
const { authenticationToken } = require("../utilities");

router.route("/signup").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/get-admin-details").get(authenticationToken,getAdminDetails)
router.route("/edit-admin-profile").put(authenticationToken,editAdminProfile)
router.route("/get-all-orders").get(getAllOrders)
router.route("/update-order-status").put(updateOrderStatus)

module.exports = router;