const router = require("express").Router();

const OngoingFeedback = require("../models/ongoing_feedback.modal");

// create new ongoing feedback
router.post("/create", (req, res) => {
  var body = req.body;
  const sender_id = body.sender_id;
  const reciever_one_id = body.reciever_one_id;
  const org_id = body.org_id;
  const level = body.level;
  const comment = body.comment;

  const new_ongoing_feedback = new OngoingFeedback({
    sender_id,
    reciever_one_id,
    org_id,
    level,
    comment,
  });
  new_ongoing_feedback.save((err, result) => {
    if (err)
      return res.json({ status: "fail", msg: "Server Error! cannot create" });
    return res.json({ status: "success", msg: "Created successfully" });
  });
});

// update ongoing feedback
router.post("/update", (req, res) => {
  var body = req.body;
  console.log(body);
  const _id = body._id;
  const sender_id = body.sender_id;
  const reciever_one_id = body.reciever_one_id;
  const org_id = body.org_id;
  const level = body.level;
  const comment = body.comment;

  OngoingFeedback.findOneAndUpdate(
    {
      _id: _id,
    },
    { sender_id, reciever_one_id, org_id, level, comment },
    (err, doc) => {
      if (err)
        return res.json({ status: "fail", msg: "Server Error! cannot update" });
      return res.json({ status: "success", msg: "Updated successfully" });
    }
  );
});

//  delete ongoing feedback
router.post("/delete", (req, res) => {
  const _id = req.body._id;
  OngoingFeedback.deleteOne(
    {
      _id: _id,
    },
    (err) => {
      if (err)
        return res.json({ status: "fail", msg: "Server Error! cannot delete" });
      return res.json({ status: "success", msg: "Deleted successfully" });
    }
  );
});

module.exports = router;
