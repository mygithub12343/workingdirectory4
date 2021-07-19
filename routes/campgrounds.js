var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

//CREATE ROUTE : add a new campground to DB
router.post("/",middleware.isLoggedIn,function (req,res) {
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var price = req.body.price;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   var newCampground = {
       name : name,
       price : price,
       image : image,
       description : desc,author:author
    };
   //create a new CG and save to DB
   Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            req.flash("error",err);
        } else{
             //redirect back to campgrounds page
             req.flash("success","Campground Added Successfully!") 
             res.redirect("/campgrounds");
        }
   });
  
});

//NEW :  Displays form to add a new CG to DB
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//SHOW : Displays more data about particular CG from DB (should be after every NEW route)
router.get("/:id",function(req,res){
    //Find CG with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            req.flash("error",err);
        } else{
            //render show template with that campground
                res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

// edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
        });
});


// update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            req.flash("error",err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success","Updated Campground Successfully!");
            res.redirect("/campgrounds/" + req.body.params.id);
        }
    });
});

//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error",err);
            res.redirect("/campgrounds");
        } else{
            req.flash("success","Deleted Campground Successfully!");
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;