const adminLogin = require('../controllers/adminLogin');
const adminAuth = require('../middlewares/adminAuth');
const refreshToken = require('../middlewares/refreshToken');

const adminapi = require('express').Router()

// root route --> api/admin/...
adminapi.post('/login', adminLogin)
adminapi.post('/auth', refreshToken)


module.exports = adminapi;