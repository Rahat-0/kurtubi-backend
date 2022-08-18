const { teacherAction } = require('../controllers/teacherAction');
const imageUplaod = require('../middlewares/imageUpload');
const refreshToken = require('../middlewares/refreshToken');
const teacherAuth = require('../middlewares/teacherAuth');
const teacherValidation = require('../middlewares/teacherValidation');
const teacherapi = require('express').Router()

// root route --> api/teacher/...

// teacher/admin purpose
teacherapi.post('/auth', refreshToken)
teacherapi.get('/single', teacherAuth, teacherAction.singleThacher)
teacherapi.get('/one/:id', teacherAction.oneThacher)
teacherapi.put('/update', imageUplaod.single('image'), teacherAction.updateTeacher)

// for admin purpose
// get all teachers
teacherapi.get('/branch', teacherAction.allbranch);
teacherapi.get('/count/:branch', teacherAction.counts)
teacherapi.get('/all/:branch', teacherAction.allThacher);

// add teachers. require data...
teacherapi.post('/add', imageUplaod.single('image'), teacherValidation, teacherAction.addTeacher)

// delete one teachers. require teacher_id.
teacherapi.delete('/delete/:id', teacherAction.deleteTeacher)

// update permision, require boolean ispermit -true- or -false- .
teacherapi.patch('/isparmitall', teacherAction.isParmitAll)

// update permision, require teacher_id and boolean ispermit -true- or -false- .
teacherapi.patch('/isparmitone', teacherAction.isParmitOne)

// update teacher's password, require password, newPassword
teacherapi.post('/updatepassword', teacherAuth, teacherAction.updatePassword)

module.exports = teacherapi;