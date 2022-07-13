const db = require('../sql')

const addressAction = {

    allTeachers(req, res, next){
        const queryString = `SELECT 
        teacher_id, full_name, subject, phone, image, division, district,
        police_station, post_office, village
        FROM addresses NATURAL JOIN teachers`
    db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            if(result[0]){
                res.json(result)
           }else{
            return res.json({error : 'user not found!!'})
           }
        })
    },

    oneTeacher(req, res, next){
        const teacher_id = req.params['id']
        const queryString = `SELECT 
        teacher_id, full_name, subject, phone, image, division, district,
        police_station, post_office, village
        FROM addresses NATURAL JOIN teachers WHERE addresses.teacher_id = '${teacher_id}'`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
           if(result[0]){
                res.json(result)
           }else{
            return res.json({error : 'user not found!!'})
           }
        })
    
    },

    allstudents(req, res, next){
        const queryString = `SELECT 
        student_id, CONCAT(first_name,' ', last_name) AS full_name, roll, phone, image, division, district,
        police_station, post_office, village
        FROM addresses NATURAL JOIN students`
    db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            if(result[0]){
                res.json(result)
           }else{
            return res.json({error : 'user not found!!'})
           }
        })
    },

    oneStudent(req, res, next){
        const student_id = req.params['id']
        const queryString = `SELECT 
        student_id, CONCAT(first_name,' ', last_name) AS full_name, roll, phone, image, division, district,
        police_station, post_office, village
        FROM addresses NATURAL JOIN students WHERE addresses.student_id = '${student_id}'`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
           if(result[0]){
                res.json(result)
           }else{
            return res.status(404).json({error : 'user not found!!'})
           }
        })
    
    },


    udpateAddress(req, res, next){

        const {division, district,  police_station, post_office, village, student_id, teacher_id} = req.body;
        if(!student_id && !teacher_id){
            return res.json({error : "user id required!!"})
        }
        if(!division || !district ||  !police_station || !post_office || !village){
            return res.json({error : "field should not be empty!!"})
        }
        const queryString = `UPDATE addresses SET
         division = '${division}', district = '${district}', police_station = '${police_station}',
         post_office = '${post_office}', village = '${village}'
         WHERE ${student_id ? 'student_id' : 'teacher_id'} = ${student_id ? student_id : teacher_id}`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
          res.json(result)
        })
    
    },

    addAddress(req, res, next){
        const {division, district,  police_station, post_office, village, student_id, teacher_id} = req.body;
        if(!student_id && !teacher_id){
            return res.json({error : "user id required!!"})
        }
        if(!division || !district ||  !police_station || !post_office || !village){
            return res.json({error : "field should not be empty!!"})
        }
        const queryString = `INSERT INTO addresses (division, district, police_station, post_office, village, ${student_id ? 'student_id' : 'teacher_id'})
         VALUES ( '${division}', '${district}', '${police_station}', '${post_office}', '${village}', ${student_id ? student_id : teacher_id} )`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
          res.json(result)
        })
    }

}

module.exports = addressAction;