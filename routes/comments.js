var express = require("express");
var router = express.Router({mergeParams : true}); //{mergeParams:true} refer to :id params in app.js to be used in add new comment route (POST)
var Campground = require("../models/campground");
var middleware = require("../middleware");
var Comment = require("../models/comment");

//Comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error",err);
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

//Comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    //look up campgrounds using ID
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            req.flash("error",err);
            res.redirect("/campgrounds");
        } else{
             //create new comment
             Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground showpage
                    req.flash("success","Comment added successfully!");
                    res.redirect('/campgrounds/' + campground._id);
                }
             });           
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error",err);
            res.redirect("back");
        } else {
            res.render("comments/edit",{campground_id : req.params.id, comment : foundComment});
        }
    })
    
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            req.flash("error",err);
            res.redirect("back");
        } else {
            req.flash("success","Updated comment!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// COMMENTS DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.body.params.comment_id,function(err){
        if(err){
            req.flash("error",err);
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted successfully!");
            res.redirect("/campgrounds/"+req,params.id);
        }
    })
});

module.exports = router;