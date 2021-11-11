const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//var empleadoDB = mongoose.connection.useDb("empleado");

const goal_schema = new Schema({
  title: String,
  description: String,
  start_period: String,
  end_period: String,
  priority: String,
  reviewer_id: String,
  creater_id: String,
  entry_time: { type: Date, default: Date.now },
  goal_progresses: [{ type: Schema.Types.ObjectId, ref: "goal_progress" }],
  goal_review: { type: Schema.Types.ObjectId, ref: "goal_review" },
});

var Goal = mongoose.model("goal", goal_schema);
//var Goal = empleadoDB.model("goal", goal_schema);

const goal_progress_schema = new Schema({
  comment: String,
  progress: Number,
  entry_time: { type: Date, default: Date.now },
  goal: { type: Schema.Types.ObjectId, ref: "goal" },
});
var GoalProgress = mongoose.model("goal_progress", goal_progress_schema);

const goal_review_schema = new Schema({
  comment: String,
  rating: Number,
  entry_time: { type: Date, default: Date.now },
  goal: { type: Schema.Types.ObjectId, ref: "goal" },
});
var GoalReview = mongoose.model("goal_review", goal_review_schema);

module.exports = {
  Goal,
  GoalProgress,
  GoalReview,
};
