const router = require("express").Router();
const CONVERSATION = require("../models/conversationModel");

//new conv
router.post("/", async (req, res) => {
  try {
    const newConversation = await CONVERSATION.create({
      members: [req.body.senderId, req.body.receiverId],
    });
    res.status(200).json(newConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user conv

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await CONVERSATION.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get con with two user id
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await CONVERSATION.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
