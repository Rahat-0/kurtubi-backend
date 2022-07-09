const adminapi = require('./api/adminAPI');
const studentapi = require('./api/studentAPI');
const teacherapi = require('./api/teacherAPI');
const login = require('./controllers/login');

const router = require('express').Router()

// default password for student --> 123456
// default passowrd for teacher --> 000000
router.post('/login', login)
router.use('/student', studentapi)
router.use('/teacher', teacherapi)
router.use('/admin', adminapi)

module.exports = router;