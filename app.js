var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")


//Requiring Routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

//mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true ,useUnifiedTopology: true});
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true ,useCreateIndex: true,useUnifiedTopology: true})
.then(() => {
console.log("Connect to DB")}).catch(err =>{
    console.log("Error",err.message);
});
//mongodb+srv://Peter:Yelpcamp@watermelon.bqqpi.mongodb.net/<dbname>?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATON
app.use(require("express-session")({
	secret: "Black is the best color of cats!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
});

//Using Routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//process.env.PORT,process.env.IP
app.listen(process.env.PORT,process.env.IP, function(){
	console.log("Server start");
})