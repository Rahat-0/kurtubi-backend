const studentapi = require('./api/studentAPI');
const teacherapi = require('./api/teacherAPI');

const router = require('express').Router()

router.use('/student', studentapi)
router.use('/teacher', teacherapi)

module.exports = router;