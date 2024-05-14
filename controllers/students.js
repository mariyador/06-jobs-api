const Student =  require('../models/Student');
const { StatusCodes } = require('http-status-codes');
//const { BadRequestError, NotFoundError } = require('../errors');

const getAllStudents = async (req, res) => {
    res.send('register user')
};

const getStudent = async (req, res) => {
    res.send('login user')
};

const createStudent = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const student = await Student.create(req.body);
    res.status(StatusCodes.CREATED).json({ student })
};

const updateStudent = async (req, res) => {
    res.send('update student')
};

const deleteStudent = async (req, res) => {
    res.send('delete student')
};


module.exports = {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};