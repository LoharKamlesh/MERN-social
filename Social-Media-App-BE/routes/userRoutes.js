const router = require("express").Router();
const bcrypt = require("bcryptjs");
const USER = require("../models/userModel");

//update user
router.patch("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await USER.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        message: "Account has been updated",
        data: user,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only update your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await USER.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Account has been deleted",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});
//get user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await USER.findById(userId)
      : await USER.findOne({ username: username });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await USER.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return USER.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow user
router.patch("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await USER.findById(req.params.id);
      const currentUser = await USER.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant follow yourself");
  }
});
//unfollow user
router.patch("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await USER.findById(req.params.id);
      const currentUser = await USER.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow yourself");
  }
});
module.exports = router;
