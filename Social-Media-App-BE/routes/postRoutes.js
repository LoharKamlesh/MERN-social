const router = require("express").Router();
const POST = require("../models/postModel");
const USER = require("../models/userModel");

//create post
router.post("/", async (req, res) => {
  try {
    const newPost = await POST.create(req.body);
    res.status(201).json({
      message: "New post created",
      data: newPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//update post
router.patch("/:id", async (req, res) => {
  try {
    const post = await POST.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await POST.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        message: "Post updated",
        data: updatedPost,
      });
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await POST.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await POST.findByIdAndDelete(req.params.id);
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like and dislike post
router.patch("/:id/like", async (req, res) => {
  try {
    const post = await POST.findByIdAndUpdate(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//love and unlove post
// router.patch("/:id/love", async (req, res) => {
//   try {
//     const post = await POST.findByIdAndUpdate(req.params.id);
//     if (!post.loves.includes(req.body.userId)) {
//       await post.updateOne({ $push: { loves: req.body.userId } });
//       res.status(200).json("Post has been liked");
//     } else {
//       await post.updateOne({ $pull: { loves: req.body.userId } });
//       res.status(200).json("Post has been disliked");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await POST.findById(req.params.id);
    //res.status(200).json({ data: post });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get timeline post of a user following

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await USER.findById(req.params.userId);
    const userPosts = await POST.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return POST.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline post of a user
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await USER.findOne({ username: req.params.username });
    const posts = await POST.find({ userId: user._id });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
