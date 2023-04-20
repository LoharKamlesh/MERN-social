const router = require("express").Router();
const MESSAGE = require("../models/messageModel");
const CONVERSATION = require("../models/conversationModel");

//new message
router.post("/", async (req, res) => {
  try {
    const newMessage = await MESSAGE.create(req.body);
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all message from a conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await MESSAGE.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
