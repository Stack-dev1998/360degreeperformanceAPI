const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//var empleadoDB = mongoose.connection.useDb("empleado");

const question_schema = new Schema({
  org_id: String,
  department_id: String,
  question_title: String,
  entry_time: { type: Date, default: Date.now },
});
var Question = mongoose.model("employee_question", question_schema);

//<======================================== employee schema ==================================>
const employee_schema = new Schema({
  one_id: String,
  marks: [
    {
      question: { type: Schema.Types.ObjectId, ref: "question" },
      obtained_marks: String,
    },
  ],
  entry_time: { type: Date, default: Date.now },
});
var Employee = mongoose.model("employee_obtained_marks", employee_schema);

module.exports = {
  Question,
  Employee,
};
