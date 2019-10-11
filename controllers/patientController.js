const express = require('express')
const router = express.Router()
const Patient = require('../models/patient')
const Admin = require('../models/admin')
const Hospital = require('../models/hospital')
const Appointment = require('../models/appointment')
const Joi = require('joi')
const randomstring = require('randomstring')
const auth = require('../config/customFunction')
const isPatient = auth.isPatient


const patientSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    bloodGroup: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    patientID:Joi.string().required(),
    usertype: Joi.string().required(),
    fullAddress: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
})


module.exports ={
    registerGet:(req, res)=>{
        res.render('patients/register')
    },
    registerPost: async (req, res, next) => {
        try {
            const result = Joi.validate(req.body, patientSchema);

            // checking if email already exist
            Patient.findOne({ 'email': req.body.email }, (err, patient) => {
                Hospital.findOne({ 'email': req.body.email }, (err, hospital) => {
                    Admin.findOne({ 'email': req.body.email }, (err, admin) => {
                        if (admin) {
                            req.flash('error', 'email already in use')
                            return res.redirect('back')
                        }
                        if (err) {
                            console.log(err)
                            req.flash('error', 'Something Went Wrong, Please Try Again')
                            return res.redirect('back')
                        }
                    })
                    if (hospital) {
                        req.flash('error', 'E Please Try Again With A Different Email')
                        return res.redirect('back')
                    }
                    if (err) {
                        console.log(err)
                        req.flash('error', 'Something Went Wrong, Please Try Again')
                        return res.redirect('back')
                    }
                })
                if (patient) {
                    req.flash('error', 'Email already in use')
                    return res.redirect('back')
                }
                if (err) {
                    console.log(err)
                    req.flash('error', 'Something Went Wrong, Please Try Again')
                    return res.redirect('back')
                }
            })

            // Comparison of passwords
            if (req.body.password !== req.body.confirmPassword) {
                req.flash('error', 'Passwords mismatch.');
                res.redirect('back');
                return;
            }

            // Hash the password
            const hash = await Patient.hashPassword(result.value.password);
            result.value.password = hash;
            delete result.value.confirmPassword;

            

            // Setting store's acct to be inactive
            // result.value.active = false;

            // Saving store to database
            const newPatient = await new Patient(result.value);
            await newPatient.save();
            console.log(`${newPatient} created successfully.`);

            


            req.flash('success', 'Patient successfully created')
            res.redirect('/login')


        }
        catch (error) {
            next(error)
        }

    },
    profileGet:(req, res)=>{
        Patient.findById(req.user.id).then(user =>{
            res.render('patients/dashboard', { layout: 'patient', user:user })
            
        })
    },
    logoutGet: (req, res) => {
        req.logout();
        req.flash('success', 'see you later')
        res.redirect('back')
    },
    appointmentPost:(req, res)=>{
        console.log(req.params.id)
        Patient.findById(req.params.id).then(patient => {
            let newAppointment = new Appointment({
                patientID: req.body.patientID,
                hospital: req.body.hospital,
                message: req.body.message,
                appointmentDate: req.body.appointmentDate,
                email: req.body.email,
                department:req.body.department
                // fullName: patient.firstName + ' ' + patient.lastName,
                // email: patient.email
            })
            newAppointment.save().then(newAppointment => {
                console.log('Appointment savedd successfully', newAppointment)
                req.flash('success', 'Your Appointment has been booked please await further instructions')
                res.redirect('back')
            }).catch(err => {
                console.log(err)
                req.flash('error', 'Something Went Wrong Please Try Again')
                return res.redirect('back')
            })
        })
    }
}