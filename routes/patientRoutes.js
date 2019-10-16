const express = require('express')
const router = express.Router()
const patientController= require('../controllers/patientController')
const auth = require('../config/customFunction')
const isPatient = auth.isPatient
    
router.route('/register')
    .get(patientController.registerGet)
    .post(patientController.registerPost)

router.route('/profile')
    .get(isPatient,patientController.profileGet)

router.route('/logout')
    .get(patientController.logoutGet)

router.route('/appointment/:id')
    .post(isPatient,patientController.appointmentPost)

    

module.exports = router