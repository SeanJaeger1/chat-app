const express = require("express");
const Message = require("../models/message");
const router = new express.Router();

router.post("/messages", async (req, res) => {
  const message = new Message(req.body);
  try {
    await message.save();
    res.status(201).send();
  } catch (e) {
    console.log("ERROR CAUGHT", e);
    res.status(500).send();
  }
});

router.get("/messages/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room });

    if (!messages) {
      return res.status(404).send();
    }

    res
      .writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
      })
      .write(JSON.stringify(messages));
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;