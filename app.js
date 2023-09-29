//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to my Daily Journal, your ultimate destination for journaling with a twist! 🚀 Here, you can embark on your personal journey of self-expression and reflection by crafting beautiful journals filled with your thoughts, experiences, and emotions. 🤗 Our user-friendly platform makes it a breeze to compose and publish your daily musings. Whether you're chronicling your adventures, recording your thoughts, or simply celebrating the little joys in life, Daily Journal is your canvas to create and share the stories that define you. 🌟 Join our community of fellow journal enthusiasts and embark on a meaningful voyage of self-discovery.📝✨ #DailyJournal #WriteYourStory";

const app = express();

/* 
Mongoose connection to blogDB database running locally on the default port (27017). 
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
*/

//Mongoose connection to MongoDB blogDB database
mongoose.connect(process.env.MONGO_URL);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

const postSchema = {
  title : String,
  content : String
}

const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "Welcome to my Daily Journal 📝",
  content : homeStartingContent,
});

app.get("/", function(req, res){

  Post.find({})
    .then((foundPosts) => {
      if(foundPosts.length === 0) {
        post1.save();
      } else {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: foundPosts
          });
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId})
    .then((post)=>{
      res.render("post.ejs", {
        title : post.title,  
        content : post.content,
      })
    })
    .catch((err)=> {
        console.log(err);
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});