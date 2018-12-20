var express = require("express");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/latest_auth",{useNewUrlParser : true});
var pass = require("passport");
var pl = require("passport-local");
var body = require("body-parser");
var plm = require("passport-local-mongoose");
var User = require("./models/user")

//Added for new branch
var app = express();
app.use(require("express-session")({
    secret : "Hi",
    resave : false,
    saveUninitialized : false
}));

//app.use(body({urlencoded: true}));
app.use(body.urlencoded({extended: true}));


app.set("view engine","ejs");
app.use(pass.initialize());
app.use(pass.session());

pass.use(new pl(User.authenticate()));
pass.serializeUser(User.serializeUser());
pass.deserializeUser(User.deserializeUser());



//Routes
app.get("/",function(req,res)
{
    res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res)
{
    res.render("secret");
});

app.listen(process.env.PORT,process.env.IP,function(req,res)
{
    console.log("Authenicated");
});

app.get("/register", function(req,res)
{
    res.render("register");

});

app.post("/register",function(req,res)
{
   User.register(new User({username: req.body.username,}),req.body.password,function(err,d) //uname
   {
       if(err)
       {
          // res.render("register");
          console.log(err); //
          return res.render("register"); //
          
           
       }
       pass.authenticate("local")(req,res,function()
       {
           res.render("secret");
       });
     
   }) ;
});

app.get("/login", function(req,res)
{
    res.render("login");
});

app.post("/login",pass.authenticate("local",{ //if username is given uname then not working, need to ask colt
    successRedirect : "/secret",
    failureRedirect : "/login"
    
}),function(req,res)
{
    
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
    
}

app.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/");
});

//AuthRoutes
