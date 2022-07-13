const addressAction = require('../controllers/address')

const address = require('express').Router()

address.post('/add', addressAction.addAddress )
address.put('/update', addressAction.udpateAddress )
address.get('/teachers/:id', addressAction.oneTeacher )
address.get('/students/:id', addressAction.oneStudent )
// address.get('/admissions', )

// admin purpose only.
address.get('/teachers', addressAction.allTeachers  )
address.get('/students', addressAction.allstudents )                                       


module.exports = address;