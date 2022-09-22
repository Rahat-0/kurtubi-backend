
const test = require('express').Router()

test.get('/', async (req, res)=>{
   console.log('test');
   res.send('test')
})



module.exports = test