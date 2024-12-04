const express=require("express");
const router=express.Router();
const{
    createOrder,
    getAllOrders,
    getOrderByTrackingId,
    braintreeTokenController,
    braintreePaymentController,
}=require("../Controllers/orderController");
const {authenticationToken}=require("../utilities")

router.route("/neworder").post(authenticationToken,createOrder);
router.route("/get-all-orders").get(authenticationToken,getAllOrders);
router.route("/get-order/:trackingId").get(authenticationToken,getOrderByTrackingId);
router.route("/braintree/token").get(authenticationToken,braintreeTokenController);
router.route("/braintree/payment").post(braintreePaymentController);

module.exports = router;