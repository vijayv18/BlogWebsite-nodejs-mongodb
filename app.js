//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to my Daily Journal, your ultimate destination for journaling with a twist! 🚀 Here, you can embark on your personal journey of self-expression and reflection by crafting beautiful journals filled with your thoughts, experiences, and emotions. 🤗 Our user-friendly platform makes it a breeze to compose and publish your daily musings. Whether you're chronicling your adventures, recording your thoughts, or simply celebrating the little joys in life, Daily Journal is your canvas to create and share the stories that define you. 🌟 Join our community of fellow journal enthusiasts and embark on a meaningful voyage of self-discovery.📝✨ #DailyJournal #WriteYourStory";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
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
          posts: posts
          });
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
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