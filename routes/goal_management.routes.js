const router = require("express").Router();

const {
  Goal,
  GoalProgress,
  GoalReview,
} = require("../models/goal_managment.modal");

//create goal
router.post("/create-goal", (req, res) => {
  var body = req.body;
  console.log(body); 

  const title = body.title;
  const description = body.description;
  const start_period = body.start_period;
  const end_period = body.end_period;
  const priority = body.priority;
  const reviewer_id = body.reviewer_id;
  const creater_id = body.creater_id;

  const newGoal = new Goal({
    title,
    description,
    start_period,
    end_period,
    priority,
    reviewer_id,
    creater_id,
  });
  newGoal.save(function (err, goal) {
    if (err)
      return res.json({ status: "fail", msg: "Server Error! cannot create" });
    return res.json({ status: "success", msg: "Created successfully!" });
  });
});

//Update goal
router.post("/update-goal", (req, res) => {
  var body = req.body;
  console.log(body);
  const goal_id = body.goal_id;
  const title = body.title;
  const description = body.description;
  const start_period = body.start_period;
  const end_period = body.end_period;
  const priority = body.priority;
  const reviewer_id = body.reviewer_id;
  const creater_id = body.creater_id;
  Goal.findOneAndUpdate(
    {
      _id: goal_id,
    },
    {
      title,
      description,
      start_period,
      end_period,
      priority,
      reviewer_id,
      creater_id,
    },
    (err, doc) => {
      if (err) {
        return res.json({ status: "fail", msg: "Server Error! cannot delete" });
      } else {
        return res.json({ status: "success", msg: "Created successfully!" });
      }
    }
  );
});

//Delete goal
router.post("/delete-goal", (req, res) => {
  const goal_id = req.body.goal_id;
  Goal.deleteOne(
    {
      _id: goal_id,
    },
    (err) => {
      if (err)
        return res.json({ status: "fail", msg: "Server Error! cannot delete" });
      GoalProgress.deleteMany(
        {
          goal: goal_id,
        },
        (err) => {
          if (err)
            return res.json({
              status: "fail",
              msg: "Server Error! cannot delete",
            });
          GoalReview.deleteOne(
            {
              goal: goal_id,
            },
            (err) => {
              if (err)
                return res.json({
                  status: "fail",
                  msg: "Server Error! cannot delete",
                });
              return res.json({
                status: "success",
                msg: "Deleted successfully!",
              });
            }
          );
        }
      );
    }
  );
});
//get all goals
router.get("/get-all-goals", (req, res) => {
  Goal.find({})
    .populate("goal_progresses")
    .populate("goal-review")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json("error in get all goals");
    });
});

//-------------------------------------------- progress area started-----------------------------------------------
//create progress
router.post("/create-progress", (req, res) => {
  var body = req.body;
  console.log(body);
  const comment = body.comment;
  const progress = body.progress;
  const goal_id = body.goal_id;

  const newProgress = new GoalProgress({
    comment: comment,
    progress: progress,
    goal: goal_id,
  });
  newProgress.save(function (err, progress) {
    if (err)
      return res.json({
        status: "fail",
        msg: "Server Error! cannot create",
      });
    Goal.findByIdAndUpdate(
      goal_id,
      { $push: { goal_progresses: progress._id } },
      { new: true, upsert: true },
      function (err, savedGoal) {
        if (err)
          return res.json({
            status: "fail",
            msg: "Server Error! cannot create",
          });
        return res.json({
          status: "success",
          msg: "Created successfully!",
        });
      }
    );
  });
});

//update progress
router.post("/update-progress", (req, res) => {
  var body = req.body;
  console.log(body);
  const progress_id = body.progress_id;
  const comment = body.comment;
  const progress = body.progress;

  GoalProgress.findOneAndUpdate(
    {
      _id: progress_id,
    },
    {
      comment: comment,
      progress: progress,
    },
    (err, doc) => {
      if (err)
        return res.json({
          status: "fail",
          msg: "Server Error! cannot update",
        });
      return res.json({
        status: "success",
        msg: "Updated successfully!",
      });
    }
  );
});

//delete progress
router.post("/delete-progress", (req, res) => {
  const progress_id = req.body.progress_id;
  GoalProgress.findOneAndDelete(
    {
      _id: progress_id,
    },
    (err, doc) => {
      if (err)
        return res.json({
          status: "fail",
          msg: "Server Error! cannot delete",
        });
      Goal.findOneAndUpdate(
        {
          _id: doc.goal,
        },
        { $pull: { goal_progresses: doc._id } },
        (err, doc) => {
          if (err)
            return res.json({
              status: "fail",
              msg: "Server Error! cannot delete!",
            });
          return res.json({
            status: "success",
            msg: "Deleted successfully!",
          });
        }
      );
    }
  );
});

//get progresses by goal id
router.get("/get-progresses/:goal_id", (req, res) => {
  const goal_id = req.params.goal_id;
  GoalProgress.find({ goal: goal_id })
    .then((result) => {
      return res.json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      return res.json({
        status: "fail",
        msg: "Server Error! cannot get progress",
      });
    });
});

//get all progresses
router.get("/get-all-progress", (req, res) => {
  GoalProgress.find({})
    .then((result) => {
      return res.json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      return res.json({
        status: "fail",
        msg: "Server Error! cannot get all progresses",
      });
    });
});

//----------------------------------------- Review area started ---------------------------------------
//create review
router.post("/create-review", (req, res) => {
  var body = req.body;
  console.log(body);
  const comment = body.comment;
  const rating = body.rating;
  const goal_id = body.goal_id;

  const newReview = new GoalReview({
    comment: comment,
    rating: rating,
    goal: goal_id,
  });
  newReview.save(function (err, review) {
    if (err)
      return res.json({
        status: "fail",
        msg: "Server Error! cannot create",
      });
    Goal.findByIdAndUpdate(
      goal_id,
      { goal_review: review._id },
      function (err, savedGoal) {
        if (err)
          return res.json({
            status: "fail",
            msg: "Server Error! cannot create",
          });
        return res.json({
          status: "success",
          msg: "Created successfully!",
        });
      }
    );
  });
});

//update review
router.post("/update-review", (req, res) => {
  var body = req.body;
  const review_id = body.review_id;
  const comment = body.comment;
  const rating = body.rating;
  Model.findOneAndUpdate(
    {
      _id: review_id,
    },
    {
      comment: comment,
      rating: rating,
    },
    (err, doc) => {
      if (err)
        return res.json({
          status: "fail",
          msg: "Server Error! cannot update",
        });
      return res.json({
        status: "success",
        msg: "Updated successfully!",
      });
    }
  );
});

//delete review
router.post("/delete-review", (req, res) => {
  const review_id = req.body.review_id;
  GoalReview.findOneAndDelete(
    {
      _id: review_id,
    },
    (err, doc) => {
      if (err)
        return res.json({
          status: "fail",
          msg: "Server Error! cannot delete",
        });
      Goal.findOneAndUpdate(
        {
          _id: doc.goal,
        },
        { goal_review: undefined },
        (err, doc) => {
          if (err)
            return res.json({
              status: "fail",
              msg: "Server Error! cannot delete",
            });
          return res.json({
            status: "success",
            msg: "Deleted successfully!",
          });
        }
      );
    }
  );
});

//get review by goal id
router.get("/get-review/:goal_id", (req, res) => {
  const goal_id = req.params.goal_id;
  GoalReview.find({ goal: goal_id })
    .then((result) => {
      return res.json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      return res.json({
        status: "success",
        msg: "Server Error! cannot get review by goal id",
      });
    });
});

//get all reviews
router.get("/get-all-reviews", (req, res) => {
  GoalReview.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json("error in get all reviews");
    });
});

module.exports = router;
