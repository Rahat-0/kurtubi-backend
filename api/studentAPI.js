const resultAction = require('../actions/resultAction');
const { studentAction } = require('../actions/studentAction');
const studentAuth = require('../middlewares/studentAuth');
const studentValidation = require('../middlewares/studentValidation')
const imageUpload = require('../middlewares/imageUpload')
const studentapi = require('express').Router()

//root route--> api/student/...

// public routes
// default password --> 123456
studentapi.post('/login', studentAction.studentLogin )

// protected routes
// student profile routes
//preferred for admins only.
studentapi.get('/', studentAction.allstudent )
studentapi.post('/add', imageUpload.single('image'), studentValidation,  studentAction.addOneStudent)
studentapi.post('/update', studentValidation , studentAction.updateOneStudent)
//requird student_id.
studentapi.put('/resetpassword', studentAction.resetPassword)

// preferred for students only.
studentapi.get('/single', studentAuth, studentAction.oneStudent )
studentapi.post('/updatepassword', studentAuth, studentAction.updatePassword )



// student result routes
// get all student list. required class number and semester number through params. 
studentapi.get('/result/all/:classes/:semester', resultAction.resultAll)

// get all result for one student. required student_id though params.
studentapi.get('/result/:student_id', resultAction.resultOneAll )

// insert one students result. required data (student_id, semester, subject_name, subject_result, subject_ranking),
studentapi.post('/result/add', resultAction.resultAdd )

// udpate one students result. required data (student_id, semester, subject_name, subject_result, subject_ranking),
// optional (updated_semester, updated_subject_name).
studentapi.put('/result/update', resultAction.resultUpdate )

// delete one student's result. required data (student_id, semester, subject)
studentapi.delete('/result/delete', resultAction.resultDelete )


module.exports = studentapi;