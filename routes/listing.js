const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single("listing[image]"),validateListing,
    wrapAsync(listingController.createListing)
);

router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/search",wrapAsync(async(req,res)=>{
    let{query}=req.query;
    if(!query){
        req.flash("error","Search query missing");
        return res.redirect("/listings");
    }
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    });
    
    res.render("listings/index.ejs",{allListings,query});
}));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// New Route

// SHOW ROUTE



//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;