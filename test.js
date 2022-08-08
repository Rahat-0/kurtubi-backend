const test = require('express').Router()

test.get('/', (req, res)=>{
    res.json('test success')
    
})


module.exports = test