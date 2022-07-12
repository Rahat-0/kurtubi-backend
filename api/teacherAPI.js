const { teacherAction } = require('../controllers/teacherAction');
const imageUplaod = require('../middlewares/imageUpload');
const teacherValidation = require('../middlewares/teacherValidation');
const teacherapi = require('express').Router()

// root route --> api/teacher/...

// teacher/admin purpose
teacherapi.get('/one/:id', teacherAction.oneThacher)
teacherapi.put('/update', imageUplaod.single('image'), teacherAction.updateTeacher)

// for admin purpose
// get all teachers
teacherapi.get('/all', teacherAction.allThacher);
// add teachers. require data...
teacherapi.post('/add', imageUplaod.single('image'), teacherValidation, teacherAction.addTeacher)
// delete one teachers. require teacher_id.
teacherapi.delete('/delete/:id', teacherAction.deleteTeacher)


module.exports = teacherapi;