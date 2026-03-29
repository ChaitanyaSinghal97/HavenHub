const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn}=require("../middleware.js");

const reviewController=require("../controller/review.js");

//Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review
router.delete("/:reviewId",wrapAsync(reviewController.deleteReview));

module.exports= router;