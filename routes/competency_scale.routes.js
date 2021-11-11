const router = require("express").Router();
const { Question, Employee } = require("../models/competency.modal");
//create new question
router.post("/create-question", (req, res) => {
  const org_id = req.body.org_id;
  const department_id = req.body.department_id;
  const question_title = req.body.question_title;
  const newQuestion = new Question({
    org_id,
    department_id,
    question_title,
  });
  newQuestion.save((err, result) => {
    if (err)
      return res.json({ status: "fail", msg: "Server Error! cannot create" });
    return res.json({ status: "success", msg: "Created successfully!" });
  });
});

//update question
router.post("/update-question", (req, res) => {
  const _id = req.body._id;
  const org_id = req.body.org_id;
  const department_id = req.body.department_id;
  const question_title = req.body.question_title;
  Question.findOneAndUpdate(
    {
      _id,
    },
    {
      org_id,
      department_id,
      question_title,
    },
    (err, doc) => {
      if (err)
        return res.json({ status: "fail", msg: "Server Error! cannot update" });
      return res.json({ status: "success", msg: "Updated successfully!" });
    }
  );
});

//delete question
router.post("/delete-question", (req, res) => {
  const _id = req.body._id;
  Question.deleteOne(
    {
      _id,
    },
    (err) => {
      if (err)
        return res.json({ status: "fail", msg: "Server Error! cannot delete" });
      return res.json({ status: "success", msg: "Deleted successfully!" });
    }
  );
});

//-------------------------------------------- Employee area ----------------------------------------
//create new question
router.post("/create-employee", (req, res) => {
  const one_id = req.body.one_id;
  const newEmployee = new Employee();
  newEmployee.one_id = one_id;
  newEmployee.save((err, result) => {
    if (err)
      return res.json({ status: "fail", msg: "Server Error! cannot create" });
    return res.json({ status: "success", msg: "Created successfully!" });
  });
});

//create new question
router.post("/add-marks", (req, res) => {
  const one_id = req.body.one_id;
  const question = req.body.q_id;
  const obtained_marks = req.body.obtained_marks;

  Employee.findOneAndUpdate(
    { one_id: one_id },
    {
      $push: { marks: { question, obtained_marks } },
    },
    (err, doc) => {
      if (err)
        return res.json({
          status: "fail",
          msg: "Server Error! cannot create",
        });
      return res.json({ status: "success", msg: "Created successfully!" });
    }
  );
});
//get employee question
router.post("/get-employee", (req, res) => {
  const one_id = req.body.one_id;
  Employee.find({ one_id: one_id })
    .populate("marks.question")
    .then((result, err) => {
      console.log(result);
      if (err)
        return res.json({
          status: "fail",
          msg: "Server Error! cannot get employee",
        });
      return res.json({ status: "success", data: result });
    });
});
module.exports = router;
