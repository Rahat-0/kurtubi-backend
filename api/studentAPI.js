const { studentAction } = require('../controllers/studentAction');
const studentAuth = require('../middlewares/studentAuth');
const studentValidation = require('../middlewares/studentValidation')
const imageUpload = require('../middlewares/imageUpload');
const refreshToken = require('../middlewares/refreshToken');
const studentapi = require('express').Router()

//root route--> api/student/...

// protected routes
// student profile routes
//preferred for admins only.
studentapi.get('/auth', refreshToken)
studentapi.get('/branch', studentAction.allbranch);
studentapi.get('/all/:branch', studentAction.allstudent );
studentapi.get('/count/:branch', studentAction.counts)
studentapi.post('/add', imageUpload.single('image'), studentValidation,  studentAction.addOneStudent)
studentapi.post('/update', studentValidation , studentAction.updateOneStudent)
//requird student_id.
studentapi.put('/resetpassword', studentAction.resetPassword)

// preferred for students only.
studentapi.get('/single', studentAuth, studentAction.oneStudent )
studentapi.post('/updatepassword', studentAuth, studentAction.updatePassword )



module.exports = studentapi;