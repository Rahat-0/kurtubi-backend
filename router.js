const address = require('./api/addressAPI');
const adminapi = require('./api/adminAPI');
const resultapi = require('./api/resultAPI');
const studentapi = require('./api/studentAPI');
const teacherapi = require('./api/teacherAPI');
const login = require('./controllers/login');
const studentAuth = require('./middlewares/studentAuth');
const test = require('./test');

const router = require('express').Router()

// default password for student --> 123456
// default passowrd for teacher --> 000000
router.post('/login', login)
router.use('/student', studentapi)
router.use('/address', address)
router.use('/teacher', teacherapi)
router.use('/result', resultapi)
router.use('/admin', adminapi)
router.use('/test',  test)

module.exports = router;