const resultAction = require('../controllers/resultAction')
const adminAuth = require('../middlewares/adminAuth')
const teacherAuth = require('../middlewares/teacherAuth')
const resultapi = require('express').Router()

// get branch and class of the whole student
resultapi.get('/branchandclass', resultAction.branchAndClass)

// student result routes
// get all student list. required branch name and semester number through params. 
resultapi.get('/all/:branch/:classes', adminAuth, resultAction.resultAll)

// get all result for one student. required student_id though params.
resultapi.get('/one/:id', resultAction.resultOneAll )

// insert one students result. required data (student_id, semester, subject_name, subject_result, subject_ranking),
resultapi.post('/teacheraddmany', teacherAuth, resultAction.resultAddTeacher )

// insert one students result. required data (student_id, result_semester, result_class, subject_name, subject_result, subject_ranking),
resultapi.post('/addmany', adminAuth,  resultAction.resultAddMany )

// udpate one students result. required data (student_id, semester, subject_name, subject_result, subject_ranking),
// optional (updated_semester, updated_subject_name).
resultapi.put('/update', resultAction.resultUpdate )

// delete one student's result. required data (student_id, semester, subject)
resultapi.delete('/delete', resultAction.resultDelete )

module.exports = resultapi;