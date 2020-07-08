var express     = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//index route
router.get("/",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
		}
	});
	
})

//Create - add new camgrounds to DB
router.post("/",middleware.isLoggedIn ,function(req,res){
	var name= req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, image:image,description:desc,author:author,price:price};
	Campground.create(newCampground,function(err,newCamp){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})
	

})

//New - show form  to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})

//Show - shows info about the id
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
})

//Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit",{campground:foundCampground});
	});
});

//Update campgrond route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){

	Campground.findByIdAndUpdate(req.params.id,req.body.campground,{useFindAndModify: false},function(err,campground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//Destroy Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findByIdAndRemove(req.params.id,{useFindAndModify: false},function(err,campground){
			if(err){
				res.redirect("/campgrounds");
			}else{
				res.redirect("/campgrounds");
			}
		})

})



module.exports = router;