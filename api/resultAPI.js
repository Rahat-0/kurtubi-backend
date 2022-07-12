const resultAction = require('../controllers/resultAction')
const teacherAuth = require('../middlewares/teacherAuth')
const resultapi = require('express').Router()

// student result routes
// get all student list. required class number and semester number through params. 
resultapi.get('/all/:classes/:semester', resultAction.resultAll)

// get all result for one student. required student_id though params.
resultapi.get('/one/:id', resultAction.resultOneAll )

// insert one students result. required data (student_id, semester, subject_name, subject_result, subject_ranking),
resultapi.post('/add', teacherAuth,  resultAction.resultAdd )

// udpate one students result. required data (student_id, semester, subject_name, subject_result, subject_ranking),
// optional (updated_semester, updated_subject_name).
resultapi.put('/update', resultAction.resultUpdate )

// delete one student's result. required data (student_id, semester, subject)
resultapi.delete('/delete', resultAction.resultDelete )

module.exports = resultapi;