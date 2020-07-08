var express     = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments new
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err || !campground){
			req.flash("error","Something went wrong")
			res.redirect("back");
		}else{
			res.render("comments/new",{campground:campground})
		}
	})
})

//Comments create
router.post("/", middleware.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","Something went wrong")
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save()
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});
//Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("Campground not found");
			res.redirect("back");
		}else{
			Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err || !foundComment){
					req.flash("error","Can not found that foundComment");
					return res.redirect("back");
				}else{
					res.render("comments/edit",{campground_id: req.params.id,comment:foundComment});
				}
			})
		}
	})
})

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,{useFindAndModify:false},function(err, updatedComment){
		if(err || !updatedComment){
			req.flash("Comment not found");
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})
//Comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,{useFindAndModify:false},function(err){
		if(err){
			req.flash("Comment not found");
			res.redirect("back");
		}else{
			req.flash("success","Comment Deleted!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})



module.exports = router;
