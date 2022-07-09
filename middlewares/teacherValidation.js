const teacherValidation = (req, res, next) => {
    const {  full_name, email, dob, designation, subject, education, varsity_name, gender, phone, ispermit } = req.body;
    try {
         if (!full_name) {
            return res.json({ error: 'full name required!!' }) 
        } else if (!email) {
            return res.json({ error: 'email required!!' })
        } else if (!dob) {
            return res.json({ error: 'date of birth required!!' })
        } else if (!phone) {
            return res.json({ error: 'phone number required!!' })
        } else if (!designation) {
            return res.json({ error: 'designation required!!' })
        } else if (!subject) {
            return res.json({ error: 'subject name required!!' })
        } else if (!education) {
            return res.json({ error: 'education required!!'  })
        } else if (!gender) {
            return res.json({ error: 'gender required!!' })
        }else if (!varsity_name) {
            return res.json({ error: 'varsity name required!!' })
        }

        if (full_name.length > 50) {
            return res.json({ error: 'first name too long!!' })
        }else if (!email.length > 50) {
            return res.json({ error: 'email too long!!' })
        } else if (!dob.length > 10) {
            return res.json({ error: 'date of birth too long!!' })
        } else if (!phone.length > 20) {
            return res.json({ error: 'phone number too long!!' })
        } else if (!designation.length > 100) {
            return res.json({ error: 'designation too long!!' })
        } else if (!subject.length > 50) {
            return res.json({ error: 'subject name too long!!' })
        } else if (!varsity_name.length > 200) {
            return res.json({ error: 'varsity_name too long!!' })
        }else if (!education.length > 200) {
            return res.json({ error: 'education too long!!' })
        }

        if (gender !== 'male' && gender !== 'female') {
            return res.json({ error: 'gender must be valid!!' })
        }

        req.validation = { full_name, email, dob, designation, subject, education, varsity_name, gender, phone, ispermit }
        next()
    } catch (error) {
        next(error)
        return;
    }

}

module.exports = teacherValidation;