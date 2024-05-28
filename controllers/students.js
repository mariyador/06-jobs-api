const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllStudents = async (req, res) => {
  const students = await Student.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ students, count: students.length });
};

const getStudent = async (req, res) => {
  const {
    user: { userId },
    params: { id: studentId },
  } = req;

  const student = await Student.findOne({
    _id: studentId,
    createdBy: userId,
  });

  if (!student) {
    throw new NotFoundError(`No student was found with id ${studentId}`);
  }

  res.status(StatusCodes.OK).json({ student });
};

const createStudent = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json({ student });
};

const updateStudent = async (req, res) => {
  const {
      body: { studentName, educationLevel, age },
      user: { userId },
      params:{ id: studentId }
  } = req;
  if (studentName === '' || educationLevel === '' || age === '') {
      throw new BadRequestError('Name, education level or age cannot be empty')
  }
  const student = await Student.findByIdAndUpdate(
      {
      _id: studentId,
      createdBy: userId
      },
      req.body,
      {
          new: true,
          runValidators: true
      }
  );
  if (!student) {
      throw new NotFoundError(`No student was found with id ${studentId}`);
  }
  res.status(StatusCodes.OK).json({ student });
};

const deleteStudent = async (req, res) => {
    const {
      user: { userId },
      params: { id: studentId },
    } = req;
 
    const student = await Student.findOneAndDelete({
      _id: studentId,
      createdBy: userId,
    });
    if (!student) {
      throw new NotFoundError(`No student with id: ${studentId}`);
    }
    res.status(StatusCodes.OK).send("Student has been successfully deleted");
 };

module.exports = {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};