const express = require("express");
const router = require("./router");
const  db  = require("./sql");
const bodyparser = require('body-parser')
const env = require("dotenv").config();
const app = express();
const cors = require('cors')
const port = process.env.port || 4000;

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended : true}))
app.use(express.static("public"))

app.get('/', (req, res)=> res.json({message : 'welcome to server!!!'}))
app.use('/api', router)

app.use((err, req, res, next)=>{
  console.log(err)
  res.json({error : 'error handled!! ' + err.message })
})
app.listen(port, () => {
    db && console.log('database connected')
  console.log(`server running at ${port}`);

});
