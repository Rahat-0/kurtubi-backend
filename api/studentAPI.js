const { studentAction } = require('../controllers/studentAction');
const studentAuth = require('../middlewares/studentAuth');
const studentValidation = require('../middlewares/studentValidation')
const imageUpload = require('../middlewares/imageUpload');
const refreshToken = require('../middlewares/refreshToken');
const resultAction = require('../controllers/resultAction');
const adminAuth = require('../middlewares/adminAuth');
const studentapi = require('express').Router()

//root route--> api/student/...

// protected routes
// student profile routes
//preferred for admins only.
studentapi.get('/branch', studentAction.allbranch);
studentapi.get('/all/:branch', adminAuth, studentAction.allstudent );
studentapi.get('/count/:branch', studentAction.counts)
studentapi.post('/add', imageUpload.single('image'), studentValidation,  studentAction.addOneStudent)
studentapi.post('/update', studentValidation , studentAction.updateOneStudent)
studentapi.post('/block', adminAuth, studentAction.blockStudent)
//requird student_id.
studentapi.put('/reset', adminAuth, studentAction.resetPassword)

// preferred for students only.
studentapi.post('/auth', refreshToken)
studentapi.get('/single', studentAuth, studentAction.oneStudent )
studentapi.get('/result', studentAuth, resultAction.resultOneStudent)
studentapi.post('/updatepassword', studentAuth, studentAction.updatePassword )



module.exports = studentapi;