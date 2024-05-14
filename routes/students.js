const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/students");

router.route("/").post(createStudent).get(getAllStudents);
router.route("/:id").get(getStudent).delete(deleteStudent).patch(updateStudent);

module.exports = router;
