//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5"); //hash
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
  secret: 'our little secret.',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

//Creating Local Strategy. passport-local-mongoose 3 lines of code for Strategy, 
//Serialiazation, Deserialization not working due to recent changes in Mongoose 7
passport.use(new LocalStrategy((username,password,done)=>{  //done is a callback function
    try{
        User.findOne({username:username}).then(user=>{
            if (!user){
                return done(null,false, {message:"Incorrect Username"})
            }
 //using bcrypt to encrypt passoword in register post route and compare function in login post round. 
 //login post route will check here during authentication so need to use compare here  
            bcrypt.compare(password,user.password,function(err,result){ 
                if (err){
                    return done(err)
                }

                if (result) {
                    return done(null,user)
                }
                else {
                    return done (null,false, {message:"Incorrect Password"})
                }
            })

        })
    }
    catch (err){
            return done(err)
    }

}))
//serialize user
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
//deserialize user  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req,res){
    res.render("home");
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/secrets", function(req,res){
    User.find({"secret": {$ne:null}}).then((foundUsers)=>{
        res.render("secrets", {usersWithSecrets: foundUsers});
    });
});

app.get("/submit", function(req,res){
    if (req.isAuthenticated) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", function(req,res){
    const submittedSecret = req.body.secret;
    console.log(req.user)

    User.findById(req.user.id).then((foundUser) => {
        foundUser.secret = submittedSecret;
        foundUser.save(() => {
            res.redirect("/secrets")
        });
    });
});

app.get("/logout", function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err)
        }
        res.redirect("/");
    });
});

app.post("/register", function(req,res){

/*     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        // Store hash in your password DB.
        newUser.save().then(()=>{
            res.render("secrets");
        }).catch((err)=>{
            console.log(err);
        })
    }); */

    User.register({username: req.body.username}, req.body.password, function(err,user){
        if (err) {
            console.log(err)
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })

});

app.post("/login", function(req,res){
/*     const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: username}).then((foundUser) => {
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if (result==true) {
            res.render("secrets");
            }
        });
    }); */

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }

    });

});





app.listen(3000, function(){
    console.log("Server started on port 3000.")
})
